const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const StoreSettings = require('../models/StoreSettings');
const SupportMessage = require('../models/SupportMessage');
const { optionalAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// GET /api/settings/contact - public, powers the homepage/footer contact section
router.get('/settings/contact', async (req, res) => {
  const settings = await StoreSettings.findOne({ singleton: 'CONFIG' });
  res.json({
    whatsappNumber: settings?.whatsappNumber || '',
    supportPhone: settings?.supportPhone || '',
    supportEmail: settings?.supportEmail || '',
    socialLinks: settings?.socialLinks || {},
  });
});

// Same abuse-prevention reasoning as the auth endpoints - a public contact
// form is an easy spam target without a limit.
const supportFormLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

// POST /api/support - Help Center form; lands in the admin dashboard as a SupportMessage
router.post(
  '/support',
  supportFormLimiter,
  optionalAuth,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Enter your name'),
    body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }),
    body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
    body('message').trim().isLength({ min: 5, max: 2000 }).withMessage('Please enter a message'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { name, email, phone, subject, message } = req.body;
    await SupportMessage.create({ name, email, phone, subject, message, user: req.userId || undefined });
    res.status(201).json({ message: "Thanks - we've received your message and will get back to you soon." });
  }
);

module.exports = router;
