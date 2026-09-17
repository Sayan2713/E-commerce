const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');
const { optionalAuth } = require('../middleware/auth');

// GET /api/categories  - top-level + nested subcategories
router.get('/categories', async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  res.json({ categories });
});

// GET /api/banners  - web slider only
router.get('/banners', async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort('sortOrder');
  res.json({ banners });
});

// GET /api/products?category=&subCategory=&tag=&search=&minPrice=&maxPrice=&size=&color=&sort=&page=&ids=
router.get('/products', optionalAuth, async (req, res) => {
  const { category, subCategory, tag, search, minPrice, maxPrice, size, color, sort, page, ids, exclude } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };
  if (size) filter['variants.size'] = size;
  if (color) filter.color = new RegExp(`^${color}$`, 'i');
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }
  // ids= lets the frontend fetch a specific set of products in one call
  // (used for "Recently Viewed" - looked-up from localStorage - and for
  // "Related Products", which excludes the current product via exclude=)
  if (ids) {
    const idList = ids.split(',').filter((id) => id.match(/^[0-9a-fA-F]{24}$/));
    filter._id = { $in: idList };
  }
  if (exclude) filter._id = { ...filter._id, $ne: exclude };

  const sortMap = {
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    newest: { createdAt: -1 },
    rating: { ratingAvg: -1 },
  };

  const pageSize = 24;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: pageNum, pageSize, totalPages: Math.ceil(total / pageSize) });
});

// GET /api/products/filters  - distinct sizes/colors/price range, to populate filter UI
router.get('/products/filters', async (req, res) => {
  const [sizes, colors, priceRange] = await Promise.all([
    Product.distinct('variants.size', { isActive: true }),
    Product.distinct('color', { isActive: true, color: { $ne: null } }),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, min: { $min: '$basePrice' }, max: { $max: '$basePrice' } } },
    ]),
  ]);
  res.json({
    sizes: sizes.sort(),
    colors: colors.sort(),
    priceRange: priceRange[0] ? { min: priceRange[0].min, max: priceRange[0].max } : { min: 0, max: 5000 },
  });
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
});

// POST /api/coupons/validate  { code, subtotal }
router.post('/coupons/validate', async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: (code || '').toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
  res.json({ coupon });
});

module.exports = router;
