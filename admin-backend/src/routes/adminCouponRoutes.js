const router = require('express').Router();
const { Coupon } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ coupons });
});

// POST /api/admin/coupons
// body: { code, discountType, discountValue, minOrderValue, maxDiscountAmount,
//         reason, description, ruleMode: 'PRESET'|'CUSTOM', startsAt, expiresAt,
//         usageLimitPerUser, totalUsageLimit }
router.post('/', async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ coupon });
});

router.patch('/:id', async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return res.status(404).json({ message: 'Not found' });
  res.json({ coupon });
});

router.delete('/:id', async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Coupon deactivated' });
});

module.exports = router;
