const router = require('express').Router();
const { Order } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');
const { generateInvoicePdf } = require('../utils/invoice');
const { sendOrderStatusPush } = require('../utils/push');
const { User } = require('../models/shared');
const { bookShipment, trackShipment, assignAwb } = require('../services/shiprocketService');
const { checkAndIssueReferralReward } = require('../utils/referralReward');

router.use(requireAdmin);

// GET /api/admin/orders?status=&from=&to=
router.get('/', async (req, res) => {
  const { status, from, to } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  const orders = await Order.find(filter).sort('-createdAt').populate('user', 'name mobile email');
  res.json({ orders });
});

// PATCH /api/admin/orders/:id/status  { status }
// COD orders move through: PLACED -> PACKED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = status;
  order.statusHistory.push({ status });

  if (status === 'DELIVERED' && !order.invoiceUrl) {
    // generate GST invoice PDF only now, per requirement
    const { url } = await generateInvoicePdf(order);
    order.invoiceUrl = url;
    order.invoiceGeneratedAt = new Date();
  }
  await order.save();

  const user = await User.findById(order.user);
  sendOrderStatusPush(user, order, status); // fire-and-forget, doesn't block the response
  if (status === 'DELIVERED') checkAndIssueReferralReward(order).catch((e) => console.error('Referral reward check failed:', e.message));

  res.json({ order });
});

// POST /api/admin/orders/:id/book-shipment
// Books a real courier shipment via Shiprocket and moves the order to
// SHIPPED automatically. If Shiprocket isn't configured (no API creds),
// returns a clear error rather than a confusing crash - admin can still
// move orders through statuses manually via PATCH /:id/status as before.
router.post('/:id/book-shipment', async (req, res) => {
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    return res.status(400).json({ message: 'Shiprocket is not configured - set SHIPROCKET_EMAIL/PASSWORD in the admin backend .env' });
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.shipment?.shipmentId) return res.status(400).json({ message: 'This order already has a shipment booked' });

  try {
    const user = await User.findById(order.user);
    const shipment = await bookShipment(order, user?.email);
    order.shipment = shipment;
    // Only mark SHIPPED once a courier/AWB is actually assigned - if AWB
    // assignment failed, the Shiprocket order/shipment still got created
    // (see shipment.lastTrackedStatus), but nothing has physically been
    // handed to a courier yet, so PACKED is the more honest status.
    order.status = shipment.awbCode ? 'SHIPPED' : 'PACKED';
    order.statusHistory.push({ status: order.status });
    await order.save();

    sendOrderStatusPush(user, order, order.status);

    res.json({ order });
  } catch (err) {
    console.error('Shiprocket booking failed:', err.response?.data || err.message);
    res.status(502).json({ message: 'Could not book shipment with Shiprocket', detail: err.response?.data?.message || err.message });
  }
});

// POST /api/admin/orders/:id/retry-awb  - for when book-shipment created the
// Shiprocket order/shipment successfully but courier/AWB assignment failed
// (e.g. no serviceable courier at that moment, or a transient API error)
router.post('/:id/retry-awb', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!order.shipment?.shipmentId) return res.status(400).json({ message: 'No shipment has been created for this order yet' });
  if (order.shipment.awbCode) return res.status(400).json({ message: 'This order already has an AWB assigned' });

  try {
    const { awbCode, courierName } = await assignAwb(order.shipment.shipmentId);
    if (!awbCode) return res.status(502).json({ message: 'Shiprocket still could not assign a courier - try again shortly or check serviceability for this pincode in your Shiprocket dashboard' });

    order.shipment.awbCode = awbCode;
    order.shipment.courierName = courierName;
    order.shipment.trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
    order.shipment.lastTrackedStatus = 'Booked';
    order.status = 'SHIPPED';
    order.statusHistory.push({ status: 'SHIPPED' });
    await order.save();

    const user = await User.findById(order.user);
    sendOrderStatusPush(user, order, 'SHIPPED');

    res.json({ order });
  } catch (err) {
    res.status(502).json({ message: 'Could not assign AWB', detail: err.response?.data?.message || err.message });
  }
});

// GET /api/admin/orders/:id/track  - live pull from Shiprocket (also see
// the webhook in adminShippingWebhook.js, which updates this automatically
// as the courier scans the package, so this endpoint is mostly a manual
// refresh button rather than the only way tracking data gets updated)
router.get('/:id/track', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!order.shipment?.awbCode) return res.status(400).json({ message: 'No AWB assigned yet for this order' });

  try {
    const tracking = await trackShipment(order.shipment.awbCode);
    order.shipment.lastTrackedStatus = tracking.status;
    await order.save();
    res.json({ status: tracking.status, checkpoints: tracking.checkpoints });
  } catch (err) {
    res.status(502).json({ message: 'Could not fetch tracking status', detail: err.response?.data?.message || err.message });
  }
});

// GET /api/admin/orders/accounting/summary?month=&year=
// Full accounting breakdown: revenue, GST collected, delivery charges, discounts given
router.get('/accounting/summary', async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-12
  const year = parseInt(req.query.year, 10) || now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const orders = await Order.find({
    createdAt: { $gte: start, $lt: end },
    status: { $ne: 'CANCELLED' },
  });

  const summary = orders.reduce(
    (acc, o) => {
      acc.orderCount += 1;
      acc.subtotal += o.subtotal;
      acc.cgst += o.gst.cgstAmount;
      acc.sgst += o.gst.sgstAmount;
      acc.igst += o.gst.igstAmount;
      acc.deliveryCharges += o.deliveryCharge;
      acc.couponDiscounts += o.couponDiscount;
      acc.totalCollected += o.totalPayable;
      return acc;
    },
    { orderCount: 0, subtotal: 0, cgst: 0, sgst: 0, igst: 0, deliveryCharges: 0, couponDiscounts: 0, totalCollected: 0 }
  );

  // day-by-day breakdown within the month, for a "select date" drill-down
  const byDate = {};
  orders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    byDate[key] = byDate[key] || { orderCount: 0, totalCollected: 0 };
    byDate[key].orderCount += 1;
    byDate[key].totalCollected += o.totalPayable;
  });

  res.json({ month, year, summary, byDate });
});

module.exports = router;
