const router = require('express').Router();
const { Order, User } = require('../models/shared');
const { sendOrderStatusPush } = require('../utils/push');
const { generateInvoicePdf } = require('../utils/invoice');
const { checkAndIssueReferralReward } = require('../utils/referralReward');

// Shiprocket doesn't sign webhook payloads by default, so we protect this
// with a shared secret configured on both sides: set SHIPROCKET_WEBHOOK_TOKEN
// here and paste the same value into Shiprocket's webhook config
// (Settings -> API -> Webhooks) as a query param on the callback URL, e.g.
// https://your-api.com/api/shipping/webhook?token=<the same value>
function verifyWebhookToken(req, res, next) {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  if (!expected) return res.status(503).json({ message: 'Webhook not configured' });
  if (req.query.token !== expected) return res.status(401).json({ message: 'Invalid webhook token' });
  next();
}

// Maps Shiprocket's current_status strings to our internal Order.status enum.
// Shiprocket's exact status vocabulary can change / has many sub-states;
// this covers the common ones and falls back to just recording the raw
// string in shipment.lastTrackedStatus without changing our own status for
// anything unrecognized, rather than guessing wrong.
const STATUS_MAP = {
  'PICKED UP': 'SHIPPED',
  'IN TRANSIT': 'SHIPPED',
  'OUT FOR DELIVERY': 'OUT_FOR_DELIVERY',
  'DELIVERED': 'DELIVERED',
  'RTO INITIATED': 'RETURNED',
  'RTO DELIVERED': 'RETURNED',
  'CANCELLED': 'CANCELLED',
};

router.post('/webhook', verifyWebhookToken, async (req, res) => {
  // Shiprocket's webhook payload shape: { awb, current_status, order_id, ... }
  const { awb, current_status: currentStatus } = req.body;
  if (!awb) return res.status(400).json({ message: 'Missing awb' });

  const order = await Order.findOne({ 'shipment.awbCode': awb });
  if (!order) return res.status(404).json({ message: 'No matching order for this AWB' });

  order.shipment.lastTrackedStatus = currentStatus;

  const mappedStatus = STATUS_MAP[(currentStatus || '').toUpperCase()];
  if (mappedStatus && mappedStatus !== order.status) {
    order.status = mappedStatus;
    order.statusHistory.push({ status: mappedStatus });

    if (mappedStatus === 'DELIVERED' && !order.invoiceUrl) {
      const { url } = await generateInvoicePdf(order);
      order.invoiceUrl = url;
      order.invoiceGeneratedAt = new Date();
    }
  }
  await order.save();

  if (mappedStatus) {
    const user = await User.findById(order.user);
    sendOrderStatusPush(user, order, mappedStatus).catch(() => {});
    if (mappedStatus === 'DELIVERED') checkAndIssueReferralReward(order).catch((e) => console.error('Referral reward check failed:', e.message));
  }

  res.json({ message: 'ok' });
});

module.exports = router;
