const router = require('express').Router();
const { Order, Product } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

// GET /api/admin/analytics/sales?days=30
router.get('/sales', async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await Order.find({ createdAt: { $gte: since }, status: { $ne: 'CANCELLED' } });

  // aggregate by product (best-sellers / low performers)
  const byProduct = {}; // productId -> { name, quantitySold, revenue }
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const key = item.product?.toString();
      if (!key) return;
      if (!byProduct[key]) byProduct[key] = { productId: key, name: item.name, quantitySold: 0, revenue: 0 };
      byProduct[key].quantitySold += item.quantity;
      byProduct[key].revenue += item.basePrice * item.quantity;
    });
  });
  const productStats = Object.values(byProduct).sort((a, b) => b.quantitySold - a.quantitySold);

  // category breakdown - needs a lookup from product -> category since Order
  // only snapshots product name/price, not category
  const productIds = productStats.map((p) => p.productId);
  const products = await Product.find({ _id: { $in: productIds } }).populate('category', 'name');
  const categoryOf = {};
  products.forEach((p) => { categoryOf[p._id.toString()] = p.category?.name || 'Uncategorized'; });

  const byCategory = {};
  productStats.forEach((p) => {
    const cat = categoryOf[p.productId] || 'Uncategorized';
    byCategory[cat] = byCategory[cat] || { category: cat, quantitySold: 0, revenue: 0 };
    byCategory[cat].quantitySold += p.quantitySold;
    byCategory[cat].revenue += p.revenue;
  });

  res.json({
    days,
    bestSellers: productStats.slice(0, 10),
    lowPerformers: productStats.slice(-10).reverse(),
    categoryBreakdown: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
    totalOrders: orders.length,
    totalRevenue: productStats.reduce((sum, p) => sum + p.revenue, 0),
  });
});

module.exports = router;
