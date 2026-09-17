const router = require('express').Router();
const { body, param } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { handleValidation, addressBodyRules } = require('../validators/orderValidators');
const User = require('../models/User');
const Session = require('../models/Session');
const Coupon = require('../models/Coupon');

router.use(requireAuth);

// GET /api/users/me
router.get('/me', async (req, res) => {
  const user = await User.findById(req.userId);
  const obj = user.toObject();
  obj.hasPassword = !!obj.passwordHash; // tells the frontend whether to ask for a password (e.g. before account deletion) without ever exposing the hash itself
  delete obj.passwordHash;
  delete obj.resetTokenHash;
  res.json({ user: obj });
});

// PATCH /api/users/me  (name, profilePic, mobile)
router.patch(
  '/me',
  [
    body('name').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 80 }).withMessage('Enter a valid name'),
    body('mobile').optional({ checkFalsy: true }).trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number'),
    body('profilePic').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid image URL'),
  ],
  handleValidation,
  async (req, res) => {
    const { name, profilePic, mobile } = req.body;
    const user = await User.findById(req.userId);
    if (name) user.name = name;
    if (profilePic) user.profilePic = profilePic;
    if (mobile) user.mobile = mobile;
    await user.save();
    res.json({ user });
  }
);

// POST /api/users/me/addresses
router.post('/me/addresses', addressBodyRules, handleValidation, async (req, res) => {
  const user = await User.findById(req.userId);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

// PATCH /api/users/me/addresses/:addressId
router.patch(
  '/me/addresses/:addressId',
  [param('addressId').isMongoId(), ...addressBodyRules],
  handleValidation,
  async (req, res) => {
    const user = await User.findById(req.userId);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  }
);

// POST /api/users/me/saved-items/:productId (toggle save)
router.post(
  '/me/saved-items/:productId',
  [param('productId').isMongoId().withMessage('Invalid product')],
  handleValidation,
  async (req, res) => {
    const user = await User.findById(req.userId);
    const idx = user.savedItems.findIndex((id) => id.toString() === req.params.productId);
    if (idx >= 0) user.savedItems.splice(idx, 1);
    else user.savedItems.push(req.params.productId);
    await user.save();
    res.json({ savedItems: user.savedItems });
  }
);

// POST /api/users/me/push-token  { expoPushToken }
router.post(
  '/me/push-token',
  [body('expoPushToken').trim().notEmpty().withMessage('Missing push token')],
  handleValidation,
  async (req, res) => {
    await User.findByIdAndUpdate(req.userId, { expoPushToken: req.body.expoPushToken });
    res.json({ message: 'Push token saved' });
  }
);

router.get('/me/saved-items', async (req, res) => {
  const user = await User.findById(req.userId).populate('savedItems');
  res.json({ savedItems: user.savedItems });
});

// DELETE /api/users/me  { password }  - required for Play Store / App Store
// account-deletion compliance. This anonymizes the account rather than hard-
// deleting the document, because Order records need to keep existing for
// GST/tax record-keeping (Indian tax law requires retaining these for
// several years) - but Order.shippingAddress is already a point-in-time
// snapshot taken at order time, not a live reference to the User doc, so
// anonymizing the user here doesn't touch historical order/invoice data.
router.delete(
  '/me',
  [body('password').notEmpty().withMessage('Please confirm your password to delete your account')],
  handleValidation,
  async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Account not found' });

    // Google-only accounts have no password to confirm with - skip the check
    // for them, since there's nothing to compare against.
    if (user.passwordHash) {
      const ok = await user.comparePassword(req.body.password);
      if (!ok) return res.status(401).json({ message: 'Incorrect password' });
    }

    const deletedMarker = `deleted-${user._id}`;
    user.name = 'Deleted User';
    user.email = user.email ? `${deletedMarker}@deleted.local` : undefined;
    user.mobile = user.mobile ? deletedMarker : undefined;
    user.dob = undefined;
    user.profilePic = '';
    user.addresses = [];
    user.savedItems = [];
    user.googleId = undefined;
    user.passwordHash = undefined;
    user.expoPushToken = undefined;
    user.isActive = false;
    await user.save();

    await Session.updateMany(
      { user: user._id, isRevoked: false },
      { isRevoked: true, revokedReason: 'account-deleted' }
    );

    res.json({ message: 'Your account has been deleted.' });
  }
);

// GET /api/users/me/coupons  - personal coupons earned via referrals, etc.
router.get('/me/coupons', async (req, res) => {
  const coupons = await Coupon.find({ restrictedToUser: req.userId, isActive: true });
  res.json({ coupons });
});

module.exports = router;
