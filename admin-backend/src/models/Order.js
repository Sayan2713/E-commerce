const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, // snapshot at time of order
  image: String,
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  basePrice: { type: Number, required: true }, // snapshot, pre-tax
  isCancellable: { type: Boolean, default: true },
  isReturnable: { type: Boolean, default: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // human-readable, e.g. ORD-000123
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],

  shippingAddress: {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    landmark: String,
    postOffice: String,
    city: String,
    state: String,
    pincode: String,
  },

  // ----- price breakdown (snapshotted at order time; GST rates are admin-adjustable going forward) -----
  subtotal: { type: Number, required: true }, // sum of basePrice*qty, pre-tax
  gst: {
    type: { type: String, enum: ['CGST_SGST', 'IGST'], required: true },
    rate: { type: Number, required: true }, // effective % applied (5 or 18 per current rule)
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
  },
  deliveryCharge: { type: Number, required: true },
  couponCode: String,
  couponDiscount: { type: Number, default: 0 },
  totalPayable: { type: Number, required: true },

  paymentMethod: { type: String, default: 'COD' },

  // Courier booking + tracking (Shiprocket). Populated once the admin books
  // a shipment for this order - before that, these stay empty and status
  // updates are manual, same as before this integration existed.
  shipment: {
    provider: { type: String, enum: ['shiprocket', 'delhivery'], default: undefined },
    shipmentId: String, // provider's shipment/order ID
    awbCode: String, // Air Waybill number - the actual tracking number
    courierName: String,
    trackingUrl: String,
    lastTrackedStatus: String, // raw status string from the provider's last tracking poll
    bookedAt: Date,
  },

  status: {
    type: String,
    enum: ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    default: 'PLACED',
  },

  // Invoice PDF is only generated/shown to the customer once status === DELIVERED.
  // Before that, the app only ever surfaces `orderId`.
  invoiceGeneratedAt: Date,
  invoiceUrl: String,

  statusHistory: [{
    status: String,
    at: { type: Date, default: Date.now },
  }],

  returnRequested: { type: Boolean, default: false },
  returnReason: String,
  returnRequestedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
