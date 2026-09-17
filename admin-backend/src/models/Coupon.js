const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['FLAT', 'PERCENTAGE'], required: true },
  discountValue: { type: Number, required: true }, // 100 (rupees) or 10 (percent)
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number }, // caps PERCENTAGE discounts; ignored for FLAT

  reason: { type: String }, // e.g. "Durga Puja Special"
  description: { type: String },

  ruleMode: { type: String, enum: ['PRESET', 'CUSTOM'], default: 'PRESET' },
  restrictedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // set for personal rewards (e.g. referral coupons) - only that user can redeem it

  isActive: { type: Boolean, default: true },
  startsAt: Date,
  expiresAt: Date,
  usageLimitPerUser: { type: Number, default: 1 },
  totalUsageLimit: { type: Number }, // optional global cap
  timesUsed: { type: Number, default: 0 },
}, { timestamps: true });

couponSchema.methods.computeDiscount = function (orderSubtotal) {
  if (orderSubtotal < this.minOrderValue) return 0;
  let discount = this.discountType === 'FLAT'
    ? this.discountValue
    : (orderSubtotal * this.discountValue) / 100;
  if (this.maxDiscountAmount) discount = Math.min(discount, this.maxDiscountAmount);
  return Math.min(discount, orderSubtotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
