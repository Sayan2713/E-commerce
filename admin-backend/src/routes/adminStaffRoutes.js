const router = require('express').Router();
const { body } = require('express-validator');
const Admin = require('../models/Admin');
const { requireAdmin, requireSuperAdmin } = require('../middleware/adminAuth');
const { handleValidation } = require('../validators/authValidators');

router.use(requireAdmin, requireSuperAdmin); // this entire router is SUPER_ADMIN-only

router.get('/', async (req, res) => {
  const admins = await Admin.find().select('-passwordHash').sort('-createdAt');
  res.json({ admins });
});

// POST /api/admin/staff  { name, email, password, role }
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Enter a name'),
    body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['SUPER_ADMIN', 'STAFF']).withMessage('Invalid role'),
  ],
  handleValidation,
  async (req, res) => {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(409).json({ message: 'An admin with that email already exists' });

    const admin = new Admin({ name, email, role });
    await admin.setPassword(password);
    await admin.save();
    res.status(201).json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  }
);

// PATCH /api/admin/staff/:id  { role, isActive }
router.patch('/:id', async (req, res) => {
  const { role, isActive } = req.body;
  if (req.params.id === req.adminId && isActive === false) {
    return res.status(400).json({ message: "You can't deactivate your own account" });
  }
  const admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  if (role) admin.role = role;
  if (isActive != null) admin.isActive = isActive;
  await admin.save();
  res.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive } });
});

module.exports = router;
