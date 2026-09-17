const mongoose = require('mongoose');

/**
 * Two lookup strategies, checked in this order by the delivery-charge service:
 *  1. Exact PIN code match in `pincodeRates`
 *  2. State-level rate in `stateRates` (admin sets a rate per state, e.g.
 *     Jharkhand = local, West Bengal = regional, etc.)
 *  3. Fallback distance-based tiers in `fallbackTiers` for anything unmatched
 */
const pincodeRateSchema = new mongoose.Schema({
  pincode: { type: String, required: true, unique: true },
  zoneLabel: String, // "Local", "Regional", "National"
  rate: { type: Number, required: true },
}, { _id: false });

const stateRateSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true }, // e.g. "Jharkhand"
  zoneLabel: String,
  rate: { type: Number, required: true },
}, { _id: false });

const fallbackTierSchema = new mongoose.Schema({
  label: String, // "Local", "Regional", "National"
  maxDistanceKm: Number, // upper bound of this tier; last tier can be null (catch-all)
  rate: { type: Number, required: true },
}, { _id: false });

const deliveryConfigSchema = new mongoose.Schema({
  singleton: { type: String, default: 'CONFIG', unique: true },
  homeState: { type: String, default: 'Jharkhand' },
  pincodeRates: [pincodeRateSchema],
  stateRates: [stateRateSchema],
  fallbackTiers: [fallbackTierSchema],
}, { timestamps: true });

module.exports = mongoose.model('DeliveryZone', deliveryConfigSchema);
