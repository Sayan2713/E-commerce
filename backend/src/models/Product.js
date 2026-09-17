const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // "M", "6-7Y", "32", or custom value
  stock: { type: Number, default: 0, min: 0 },
  outOfStock: { type: Boolean, default: false }, // auto-set true when stock hits 0; admin can override either way
  lowStockAlertSent: { type: Boolean, default: false }, // avoids re-emailing admin every time this variant sells another unit while still low
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  images: [{ type: String }],

  basePrice: { type: Number, required: true }, // pre-tax, pre-delivery
  color: { type: String }, // optional, used for the color filter on search/browse
  variants: [variantSchema],
  lowStockThreshold: { type: Number, default: 5 }, // per-product override; falls back to this default

  // Admin decides these per-product when adding an item (e.g. clearance/
  // innerwear items are often non-returnable/non-cancellable). Orders
  // snapshot these flags at order time (see Order.items) so a later admin
  // change doesn't retroactively affect an order already placed.
  isCancellable: { type: Boolean, default: true },
  isReturnable: { type: Boolean, default: true },

  highlights: [String],
  additionalDetails: { type: mongoose.Schema.Types.Mixed }, // free-form key/value (fabric, fit, wash care...)

  tags: [String], // "trending", "deals", "offer" etc. for home feed sections
  isActive: { type: Boolean, default: true },

  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
}, { timestamps: true });

// keep per-variant outOfStock in sync with stock count
productSchema.pre('save', function (next) {
  this.variants.forEach((v) => {
    if (v.stock <= 0) v.outOfStock = true;
  });
  next();
});

// Two separate indexes instead of one compound one: MongoDB doesn't allow
// an array field (tags is [String]) as a non-text component of a compound
// text index - trying to insert any product with a tags array crashes with
// "Field 'tags' of text index contains an array". Text search (name/description)
// and the tag filter (used for "trending"/"deals"/etc. home feed sections)
// don't need to be the same index anyway.
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);
