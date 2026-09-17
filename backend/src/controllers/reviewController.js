const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function recomputeRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { ratingAvg: Math.round(avg * 10) / 10, ratingCount: count });
}

// GET /api/products/:id/reviews
exports.listForProduct = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name profilePic')
    .sort('-createdAt');
  res.json({ reviews });
};

// POST /api/reviews  { productId, rating, comment }
// One review per user per product; only buyers who've had the item marked
// DELIVERED can review it, so ratings reflect real purchases.
exports.create = async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const hasDelivered = await Order.exists({
    user: req.userId,
    status: 'DELIVERED',
    'items.product': productId,
  });
  if (!hasDelivered) {
    return res.status(403).json({ message: 'You can review a product after it has been delivered to you' });
  }

  const existing = await Review.findOne({ product: productId, user: req.userId });
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    await existing.save();
  } else {
    await Review.create({ product: productId, user: req.userId, rating, comment });
  }

  await recomputeRating(productId);
  res.status(201).json({ message: 'Review saved' });
};

// DELETE /api/reviews/:id  (own review only)
exports.remove = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.userId });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  await review.deleteOne();
  await recomputeRating(review.product);
  res.json({ message: 'Review removed' });
};
