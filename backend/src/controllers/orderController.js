const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const CheckoutSession = require('../models/CheckoutSession');
const { calculateGst, calculateDeliveryCharge, round2 } = require('../utils/pricing');
const { checkAndSendLowStockAlert } = require('../utils/lowStockAlert');

async function priceOrder({ items, shippingAddress, couponCode, userId }) {
  let subtotal = 0;
  const lineItems = [];
  for (const it of items) {
    const product = await Product.findById(it.productId);
    if (!product) throw new Error('Product not found');
    const variant = product.variants.find((v) => v.size === it.size);
    if (!variant || variant.outOfStock || variant.stock < it.quantity) {
      throw new Error(`${product.name} (${it.size}) is out of stock`);
    }
    const lineTotal = product.basePrice * it.quantity;
    subtotal += lineTotal;
    lineItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      size: it.size,
      quantity: it.quantity,
      basePrice: product.basePrice,
      isCancellable: product.isCancellable !== false,
      isReturnable: product.isReturnable !== false,
    });
  }

  const gst = await calculateGst(subtotal, shippingAddress.state);
  const deliveryCharge = await calculateDeliveryCharge({
    pincode: shippingAddress.pincode,
    state: shippingAddress.state,
  });

  let couponDiscount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      const withinWindow = (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.expiresAt || coupon.expiresAt >= now);
      const underGlobalCap = !coupon.totalUsageLimit || coupon.timesUsed < coupon.totalUsageLimit;
      const ownedByThisUser = !coupon.restrictedToUser || String(coupon.restrictedToUser) === String(userId);
      if (withinWindow && underGlobalCap && ownedByThisUser) {
        couponDiscount = coupon.computeDiscount(subtotal);
        appliedCoupon = coupon;
      }
    }
  }

  const totalPayable = round2(subtotal + gst.totalGstAmount + deliveryCharge - couponDiscount);

  return { lineItems, subtotal: round2(subtotal), gst, deliveryCharge, couponDiscount: round2(couponDiscount), appliedCoupon, totalPayable };
}

// POST /api/orders/price-preview  (used on the "review your order" screen)
exports.pricePreview = async (req, res) => {
  try {
    const result = await priceOrder({ ...req.body, userId: req.userId });
    delete result.appliedCoupon;
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/orders  (place order - COD only)
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const priced = await priceOrder({ items, shippingAddress, couponCode, userId: req.userId });

    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

    const order = await Order.create({
      orderId,
      user: req.userId,
      items: priced.lineItems,
      shippingAddress,
      subtotal: priced.subtotal,
      gst: {
        type: priced.gst.type,
        rate: priced.gst.rate,
        cgstAmount: priced.gst.cgstAmount,
        sgstAmount: priced.gst.sgstAmount,
        igstAmount: priced.gst.igstAmount,
      },
      deliveryCharge: priced.deliveryCharge,
      couponCode: priced.appliedCoupon ? priced.appliedCoupon.code : undefined,
      couponDiscount: priced.couponDiscount,
      totalPayable: priced.totalPayable,
      statusHistory: [{ status: 'PLACED' }],
    });

    // decrement stock, then check whether that pushed any variant to/below
    // its low-stock threshold (fire-and-forget - shouldn't block the order response)
    for (const it of items) {
      await Product.updateOne(
        { _id: it.productId, 'variants.size': it.size },
        { $inc: { 'variants.$.stock': -it.quantity } }
      );
      const updatedProduct = await Product.findById(it.productId);
      if (updatedProduct) checkAndSendLowStockAlert(updatedProduct).catch((e) => console.error('Low-stock check failed:', e.message));
    }
    if (priced.appliedCoupon) {
      priced.appliedCoupon.timesUsed += 1;
      await priced.appliedCoupon.save();
    }

    // mark any matching abandoned-cart tracking rows as converted, so the
    // reminder script never messages someone who already bought the thing
    await CheckoutSession.updateMany(
      { user: req.userId, product: { $in: items.map((it) => it.productId) }, reminderSent: false, converted: false },
      { converted: true }
    );

    res.status(201).json({ order: sanitizeOrder(order) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/orders/checkout-started  { productId, size }
// Logged when the user reaches the checkout screen with a size selected but
// hasn't placed the order yet - powers the abandoned-cart reminder job (see
// src/scripts/checkAbandonedCarts.js). Best-effort: never blocks checkout.
exports.checkoutStarted = async (req, res) => {
  try {
    const { productId, size } = req.body;
    if (!productId || !size) return res.status(400).json({ message: 'productId and size are required' });
    await CheckoutSession.create({ user: req.userId, product: productId, size });
    res.status(201).json({ message: 'ok' });
  } catch (err) {
    res.status(200).json({ message: 'ignored' }); // non-critical - never fail the checkout flow over this
  }
};

// GET /api/orders/:id  -> before DELIVERED, only orderId + status are exposed
exports.getOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order: sanitizeOrder(order) });
};

exports.listMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort('-createdAt');
  res.json({ orders: orders.map(sanitizeOrder) });
};

// PATCH /api/orders/:id/cancel
// Customers can cancel their own order any time before it's shipped, per
// the Return Policy ("cancel any time before it is marked Shipped, at no
// charge"). Restocks the reserved variants so cancelled orders don't
// permanently lock up inventory.
exports.cancelOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (!['PLACED', 'PACKED'].includes(order.status)) {
    return res.status(400).json({ message: 'This order has already shipped and can no longer be cancelled - you can request a return once it arrives.' });
  }
  if (order.items.some((it) => it.isCancellable === false)) {
    return res.status(400).json({ message: 'One or more items in this order are marked non-cancellable and cannot be cancelled.' });
  }

  order.status = 'CANCELLED';
  order.statusHistory.push({ status: 'CANCELLED' });
  await order.save();

  // restock - undo the decrement that happened at order placement
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, 'variants.size': item.size },
      { $inc: { 'variants.$.stock': item.quantity }, $set: { 'variants.$.outOfStock': false } }
    );
  }

  res.json({ order: sanitizeOrder(order) });
};

// POST /api/orders/:id/request-return  { reason }
// Only allowed once DELIVERED, and only if every item in the order is
// marked returnable (snapshotted at order time from the product's
// isReturnable flag). This doesn't process a refund automatically - it
// flags the order for the admin to review and act on manually.
exports.requestReturn = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.status !== 'DELIVERED') {
    return res.status(400).json({ message: 'You can request a return once your order has been delivered.' });
  }
  if (order.items.some((it) => it.isReturnable === false)) {
    return res.status(400).json({ message: 'One or more items in this order are marked non-returnable.' });
  }
  if (order.returnRequested) {
    return res.status(400).json({ message: 'A return has already been requested for this order.' });
  }

  order.returnRequested = true;
  order.returnReason = req.body.reason || '';
  order.returnRequestedAt = new Date();
  await order.save();

  res.json({ order: sanitizeOrder(order) });
};

function sanitizeOrder(order) {
  const obj = order.toObject();
  // Per requirement: the downloadable GST invoice PDF only appears once the
  // order is DELIVERED. Order status/tracking/price is always visible -
  // it's specifically the invoice document that's withheld pre-delivery.
  if (obj.status !== 'DELIVERED') {
    delete obj.invoiceUrl;
    delete obj.invoiceGeneratedAt;
  }
  return obj;
}
