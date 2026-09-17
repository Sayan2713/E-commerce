const mongoose = require('mongoose');

/**
 * There's no persistent multi-item cart in this app (checkout is a direct
 * "buy now" flow) - so "abandoned cart" here means: the user picked a size
 * and reached the checkout screen, but never completed the order. One
 * document per checkout attempt; matched against Orders by user+product+size
 * to see if it converted.
 */
const checkoutSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  reminderSent: { type: Boolean, default: false },
  converted: { type: Boolean, default: false }, // set true once we confirm an order was placed for this
}, { timestamps: true });

module.exports = mongoose.model('CheckoutSession', checkoutSessionSchema);
