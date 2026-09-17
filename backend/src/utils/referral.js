const crypto = require('crypto');
const User = require('../models/User');

/** Generates a short unique code like "AXQ7K2", retrying on the rare collision. */
async function generateReferralCode() {
  for (let i = 0; i < 5; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
    const exists = await User.exists({ referralCode: code });
    if (!exists) return code;
  }
  // extremely unlikely fallback if 5 collisions in a row
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

module.exports = { generateReferralCode };
