const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

// GET /api/stats - powers the homepage "Why Customers Love Us" section.
// Deliberately real numbers, not placeholder marketing copy - a store with
// zero real customers showing "10K+ Happy Customers" would be misleading.
// The frontend decides how to phrase/format these based on how small they are.
router.get('/stats', async (req, res) => {
  const [customerCount, deliveredOrderCount, reviews] = await Promise.all([
    User.countDocuments({ isActive: { $ne: false } }),
    Order.countDocuments({ status: 'DELIVERED' }),
    Review.find().select('rating'),
  ]);

  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const positiveReviewPercent = reviews.length > 0 ? Math.round((positiveReviews / reviews.length) * 100) : null;

  res.json({ customerCount, deliveredOrderCount, positiveReviewPercent, reviewCount: reviews.length });
});

module.exports = router;
