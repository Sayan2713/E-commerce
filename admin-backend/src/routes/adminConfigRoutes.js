const router = require('express').Router();
const { DeliveryZone, GstConfig } = require('../models/shared');
const { requireAdmin, requireSuperAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

async function getOrCreateDeliveryConfig() {
  let cfg = await DeliveryZone.findOne({ singleton: 'CONFIG' });
  if (!cfg) cfg = await DeliveryZone.create({ singleton: 'CONFIG' });
  return cfg;
}
async function getOrCreateGstConfig() {
  let cfg = await GstConfig.findOne({ singleton: 'CONFIG' });
  if (!cfg) cfg = await GstConfig.create({ singleton: 'CONFIG' });
  return cfg;
}

// GET/PUT delivery config (pincode rates, state rates, fallback tiers)
router.get('/delivery-config', async (req, res) => {
  res.json({ config: await getOrCreateDeliveryConfig() });
});

// Reads are available to all admin staff (order/checkout screens need this
// context); only SUPER_ADMIN can change GST rates or delivery pricing.
router.put('/delivery-config', requireSuperAdmin, async (req, res) => {
  const cfg = await getOrCreateDeliveryConfig();
  Object.assign(cfg, req.body); // { homeState, pincodeRates, stateRates, fallbackTiers }
  await cfg.save();
  res.json({ config: cfg });
});

// convenience: add/update one state rate without resending the whole array
router.put('/delivery-config/state-rate', requireSuperAdmin, async (req, res) => {
  const { state, zoneLabel, rate } = req.body;
  const cfg = await getOrCreateDeliveryConfig();
  const existing = cfg.stateRates.find((s) => s.state === state);
  if (existing) Object.assign(existing, { zoneLabel, rate });
  else cfg.stateRates.push({ state, zoneLabel, rate });
  await cfg.save();
  res.json({ config: cfg });
});

// DELETE one state rate by state name
router.delete('/delivery-config/state-rate/:state', requireSuperAdmin, async (req, res) => {
  const cfg = await getOrCreateDeliveryConfig();
  cfg.stateRates = cfg.stateRates.filter((s) => s.state !== req.params.state);
  await cfg.save();
  res.json({ config: cfg });
});

// GET/PUT GST config (admin-adjustable rates)
router.get('/gst-config', async (req, res) => {
  res.json({ config: await getOrCreateGstConfig() });
});

router.put('/gst-config', requireSuperAdmin, async (req, res) => {
  const cfg = await getOrCreateGstConfig();
  Object.assign(cfg, req.body); // { standardRate, higherRate, higherRateThreshold, homeState }
  await cfg.save();
  res.json({ config: cfg });
});

module.exports = router;
