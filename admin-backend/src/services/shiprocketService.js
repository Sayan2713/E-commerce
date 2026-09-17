const axios = require('axios');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Shiprocket tokens are valid for ~10 days; we cache in memory and only
 * re-authenticate when it's missing/expired, rather than logging in on
 * every request.
 */
async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const { data } = await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  cachedToken = data.token;
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000; // refresh a day early
  return cachedToken;
}

async function shiprocketRequest(method, path, body) {
  const token = await getAuthToken();
  const { data } = await axios({
    method,
    url: `${BASE_URL}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    data: body,
  });
  return data;
}

/** Shiprocket's `billing_last_name` is a separate required-ish field; we
 * don't collect one, so split on the last space of the full name, falling
 * back to a single-char placeholder if there's no space at all. */
function splitName(fullName) {
  const parts = (fullName || '').trim().split(' ');
  if (parts.length === 1) return { first: parts[0] || 'Customer', last: '.' };
  return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] };
}

/**
 * Books a shipment for an already-placed COD order. This is a 3-step flow
 * against Shiprocket's actual API (their `create/adhoc` endpoint alone does
 * NOT assign a courier or AWB, despite what a quick skim of their docs
 * might suggest - you have to call AWB assignment separately):
 *   1. POST /orders/create/adhoc      -> creates the order + a shipment_id
 *   2. POST /courier/assign/awb       -> assigns a courier + generates the AWB
 *   3. POST /courier/generate/pickup  -> schedules a pickup (best-effort;
 *      failure here doesn't fail the whole booking, since the shipment/AWB
 *      already exist and pickup can be retried/scheduled manually in the
 *      Shiprocket dashboard if this step has an issue)
 *
 * order: our Order mongoose doc (items, shippingAddress, subtotal, orderId, createdAt)
 * customerEmail: optional - Shiprocket's billing_email field rejects a
 * fully empty string on some account configurations, so pass the buyer's
 * email if you have it (e.g. from the User doc); falls back to a
 * synthetic placeholder otherwise.
 */
async function bookShipment(order, customerEmail) {
  const { first, last } = splitName(order.shippingAddress.fullName);

  const createPayload = {
    order_id: order.orderId,
    order_date: order.createdAt.toISOString().slice(0, 10),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    billing_customer_name: first,
    billing_last_name: last,
    billing_address: order.shippingAddress.line1,
    billing_address_2: order.shippingAddress.line2 || '',
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: 'India',
    billing_email: customerEmail || `${order.orderId.toLowerCase()}@no-email.clothstore.local`,
    billing_phone: order.shippingAddress.phone,
    shipping_is_billing: true,
    order_items: order.items.map((it) => ({
      name: it.name,
      sku: `${it.product}-${it.size}`,
      units: it.quantity,
      selling_price: it.basePrice,
    })),
    payment_method: 'COD',
    sub_total: order.subtotal,
    // Shiprocket needs package weight/dimensions for courier rate
    // calculation - these are placeholder defaults; set real per-product
    // weights on the Product model if you want accurate courier selection.
    length: 25,
    breadth: 20,
    height: 3,
    weight: 0.3,
  };

  const created = await shiprocketRequest('post', '/orders/create/adhoc', createPayload);
  const shipmentId = created.shipment_id;
  if (!shipmentId) {
    throw new Error(created.message || 'Shiprocket did not return a shipment_id - check pickup_location matches one configured in your Shiprocket account');
  }

  let awbCode = null;
  let courierName = null;
  try {
    // Omitting courier_id lets Shiprocket auto-pick the best serviceable
    // courier for this pincode - simplest default; pass a specific
    // courier_id here later if you want manual courier selection instead.
    const awbResult = await shiprocketRequest('post', '/courier/assign/awb', { shipment_id: shipmentId });
    awbCode = awbResult?.response?.data?.awb_code || null;
    courierName = awbResult?.response?.data?.courier_name || null;
  } catch (err) {
    console.error('Shiprocket AWB assignment failed (shipment was still created):', err.response?.data || err.message);
  }

  try {
    if (awbCode) {
      await shiprocketRequest('post', '/courier/generate/pickup', { shipment_id: [shipmentId] });
    }
  } catch (err) {
    // Non-fatal - the shipment and AWB already exist; pickup can be
    // scheduled manually from the Shiprocket dashboard if this fails.
    console.error('Shiprocket pickup scheduling failed (shipment/AWB were still created):', err.response?.data || err.message);
  }

  return {
    provider: 'shiprocket',
    shipmentId: String(shipmentId),
    awbCode,
    courierName,
    trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null,
    lastTrackedStatus: awbCode ? 'Booked' : 'Shipment created - AWB pending',
    bookedAt: new Date(),
  };
}

/** Polls current tracking status for an already-booked shipment. */
async function trackShipment(awbCode) {
  const result = await shiprocketRequest('get', `/courier/track/awb/${awbCode}`);
  const trackData = result?.tracking_data;
  return {
    status: trackData?.shipment_track?.[0]?.current_status || 'Unknown',
    checkpoints: trackData?.shipment_track_activities || [],
  };
}

/** Assigns (or re-attempts assigning) a courier + AWB to an existing shipment. */
async function assignAwb(shipmentId) {
  const awbResult = await shiprocketRequest('post', '/courier/assign/awb', { shipment_id: shipmentId });
  const awbCode = awbResult?.response?.data?.awb_code || null;
  const courierName = awbResult?.response?.data?.courier_name || null;

  if (awbCode) {
    try {
      await shiprocketRequest('post', '/courier/generate/pickup', { shipment_id: [shipmentId] });
    } catch (err) {
      console.error('Shiprocket pickup scheduling failed:', err.response?.data || err.message);
    }
  }

  return { awbCode, courierName };
}

module.exports = { bookShipment, trackShipment, assignAwb };
