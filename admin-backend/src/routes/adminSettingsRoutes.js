const router = require('express').Router();
const StoreSettings = require('../models/StoreSettings');
const SupportMessage = require('../models/SupportMessage');
const { requireAdmin, requireSuperAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

async function getOrCreateSettings() {
  let settings = await StoreSettings.findOne({ singleton: 'CONFIG' });
  if (!settings) settings = await StoreSettings.create({ singleton: 'CONFIG' });
  return settings;
}

// GET/PUT store settings (contact info + social links)
router.get('/store-settings', async (req, res) => {
  res.json({ settings: await getOrCreateSettings() });
});

router.put('/store-settings', requireSuperAdmin, async (req, res) => {
  const settings = await getOrCreateSettings();
  Object.assign(settings, req.body); // { whatsappNumber, supportPhone, supportEmail, socialLinks }
  await settings.save();
  res.json({ settings });
});

// GET /api/admin/support-messages?status=OPEN
router.get('/support-messages', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const messages = await SupportMessage.find(filter).sort('-createdAt');
  res.json({ messages });
});

// PATCH /api/admin/support-messages/:id  { status }
router.patch('/support-messages/:id', async (req, res) => {
  const message = await SupportMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!message) return res.status(404).json({ message: 'Not found' });
  res.json({ message });
});

module.exports = router;
