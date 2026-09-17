const GstConfig = require('../models/GstConfig');
const DeliveryZone = require('../models/DeliveryZone');

/**
 * GST rule (admin-adjustable via GstConfig):
 *  - Same state as homeState (Jharkhand)  -> CGST + SGST, split evenly
 *  - Different state                       -> IGST
 *  - Standard rate applies normally; if subtotal > higherRateThreshold, higherRate applies instead
 */
async function calculateGst(subtotal, customerState) {
  const cfg = (await GstConfig.findOne({ singleton: 'CONFIG' })) || new GstConfig();
  const rate = subtotal > cfg.higherRateThreshold ? cfg.higherRate : cfg.standardRate;
  const isIntraState = (customerState || '').trim().toLowerCase() === cfg.homeState.trim().toLowerCase();

  const totalGstAmount = (subtotal * rate) / 100;

  if (isIntraState) {
    const half = totalGstAmount / 2;
    return {
      type: 'CGST_SGST',
      rate,
      cgstAmount: round2(half),
      sgstAmount: round2(half),
      igstAmount: 0,
      totalGstAmount: round2(totalGstAmount),
    };
  }
  return {
    type: 'IGST',
    rate,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: round2(totalGstAmount),
    totalGstAmount: round2(totalGstAmount),
  };
}

/**
 * Delivery charge lookup order: exact pincode -> state rate -> distance-based fallback tiers.
 * `distanceKm` is only needed if neither pincode nor state matches (e.g. computed
 * upstream via a pincode-distance API/table you plug in later).
 */
async function calculateDeliveryCharge({ pincode, state, distanceKm }) {
  const cfg = await DeliveryZone.findOne({ singleton: 'CONFIG' });
  if (!cfg) return 0;

  const pinMatch = cfg.pincodeRates.find((p) => p.pincode === pincode);
  if (pinMatch) return pinMatch.rate;

  const stateMatch = cfg.stateRates.find(
    (s) => s.state.trim().toLowerCase() === (state || '').trim().toLowerCase()
  );
  if (stateMatch) return stateMatch.rate;

  if (distanceKm != null) {
    const tier = cfg.fallbackTiers
      .sort((a, b) => (a.maxDistanceKm ?? Infinity) - (b.maxDistanceKm ?? Infinity))
      .find((t) => t.maxDistanceKm == null || distanceKm <= t.maxDistanceKm);
    if (tier) return tier.rate;
  }

  // last-resort default so checkout never breaks on an unmapped pincode
  return cfg.fallbackTiers?.[cfg.fallbackTiers.length - 1]?.rate ?? 120;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { calculateGst, calculateDeliveryCharge, round2 };
