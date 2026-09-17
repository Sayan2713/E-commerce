const mongoose = require('mongoose');

const gstConfigSchema = new mongoose.Schema({
  singleton: { type: String, default: 'CONFIG', unique: true },
  standardRate: { type: Number, default: 5 }, // % split evenly CGST/SGST when intra-state
  higherRate: { type: Number, default: 18 }, // applied when basePrice > higherRateThreshold
  higherRateThreshold: { type: Number, default: 2500 },
  homeState: { type: String, default: 'Jharkhand' }, // intra-state => CGST+SGST; else IGST
}, { timestamps: true });

module.exports = mongoose.model('GstConfig', gstConfigSchema);
