const { User, Order, Coupon } = require('../models/shared');

const REFERRER_REWARD = { discountType: 'FLAT', discountValue: 100 };
const REFEREE_REWARD = { discountType: 'FLAT', discountValue: 100 };

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Call this whenever an order transitions to DELIVERED. If the order's
 * buyer was referred by someone, and this is their first-ever delivered
 * order, and the reward hasn't already been issued, creates one personal
 * coupon for the referrer and one for the referee (both "refer a friend,
 * both get Rs.100 off" style, but usable on any future order - not this one).
 */
async function checkAndIssueReferralReward(order) {
  const user = await User.findById(order.user);
  if (!user || !user.referredBy || user.referralRewardIssued) return;

  const deliveredOrderCount = await Order.countDocuments({ user: user._id, status: 'DELIVERED' });
  if (deliveredOrderCount !== 1) return; // only fires on the referee's FIRST delivered order

  const referrer = await User.findById(user.referredBy);
  if (!referrer) return;

  await Coupon.create({
    code: `REF-${randomSuffix()}`,
    discountType: REFERRER_REWARD.discountType,
    discountValue: REFERRER_REWARD.discountValue,
    reason: 'Referral reward',
    description: `Thanks for referring ${user.name}!`,
    ruleMode: 'CUSTOM',
    restrictedToUser: referrer._id,
    usageLimitPerUser: 1,
  });

  await Coupon.create({
    code: `WELCOME-${randomSuffix()}`,
    discountType: REFEREE_REWARD.discountType,
    discountValue: REFEREE_REWARD.discountValue,
    reason: 'Referral welcome reward',
    description: 'Thanks for joining via a referral!',
    ruleMode: 'CUSTOM',
    restrictedToUser: user._id,
    usageLimitPerUser: 1,
  });

  user.referralRewardIssued = true;
  await user.save();
}

module.exports = { checkAndIssueReferralReward };
