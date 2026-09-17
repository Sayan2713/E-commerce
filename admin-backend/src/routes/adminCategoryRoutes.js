const router = require('express').Router();
const { Category } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', async (req, res) => {
  const categories = await Category.find().sort('sortOrder');
  res.json({ categories });
});

// POST /api/admin/categories  { name, slug, parent, sizeMode, image }
router.post('/', async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

router.patch('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Not found' });
  res.json({ category });
});

router.delete('/:id', async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Category deactivated' });
});

module.exports = router;
