const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g. "Mens"
  slug: { type: String, required: true, unique: true, lowercase: true },
  image: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // null = top-level
  sizeMode: {
    type: String,
    enum: ['STANDARD', 'AGE', 'NUMERIC', 'CUSTOM'], // S/M/L | age groups | numeric (28,30,32) | custom list
    default: 'STANDARD',
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
