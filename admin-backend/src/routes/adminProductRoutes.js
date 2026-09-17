const router = require('express').Router();
const { Product } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

// GET /api/admin/products?category=&search=
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  const products = await Product.find(filter).sort('-createdAt');
  res.json({ products });
});

// POST /api/admin/products  (add item flow: category -> subcategory -> images -> name -> ...)
router.post('/', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

// PATCH /api/admin/products/:id  (edit listed item details)
router.patch('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
});

// GET /api/admin/products/low-stock  - for the dashboard badge
router.get('/low-stock', async (req, res) => {
  const products = await Product.find({ isActive: true });
  const lowStockItems = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      const threshold = p.lowStockThreshold ?? 5;
      if (!v.outOfStock && v.stock > 0 && v.stock <= threshold) {
        lowStockItems.push({ productId: p._id, name: p.name, size: v.size, stock: v.stock, threshold });
      }
    });
  });
  res.json({ lowStockItems, count: lowStockItems.length });
});

// PATCH /api/admin/products/:id/variants/:size/stock  { stock } or { outOfStock }
router.patch('/:id/variants/:size/stock', async (req, res) => {
  const { stock, outOfStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  const variant = product.variants.find((v) => v.size === req.params.size);
  if (!variant) return res.status(404).json({ message: 'Variant not found' });
  if (stock != null) variant.stock = stock;
  if (outOfStock != null) variant.outOfStock = outOfStock; // manual admin override
  // restocked above the threshold - clear the flag so the next dip triggers a fresh alert
  if (variant.stock > (product.lowStockThreshold ?? 5)) variant.lowStockAlertSent = false;
  await product.save();
  res.json({ product });
});

router.delete('/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product deactivated' });
});

module.exports = router;
