const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const INVOICE_DIR = path.resolve(__dirname, '../../invoices');
if (!fs.existsSync(INVOICE_DIR)) fs.mkdirSync(INVOICE_DIR, { recursive: true });

async function generateInvoicePdf(order) {
  const filePath = path.join(INVOICE_DIR, `${order.orderId}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('Tax Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10)
    .text(`Order ID: ${order.orderId}`)
    .text(`Date: ${order.createdAt.toDateString()}`)
    .text(`Ship to: ${order.shippingAddress.fullName}, ${order.shippingAddress.line1}${order.shippingAddress.landmark ? `, Near ${order.shippingAddress.landmark}` : ''}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`);
  doc.moveDown();

  doc.fontSize(11).text('Items', { underline: true });
  order.items.forEach((it) => {
    doc.fontSize(10).text(`${it.name}  |  Size: ${it.size}  |  Qty: ${it.quantity}  |  Rs. ${it.basePrice}`);
  });

  doc.moveDown();
  doc.fontSize(11).text('GST Breakdown', { underline: true });
  doc.fontSize(10).text(`Subtotal: Rs. ${order.subtotal}`);
  if (order.gst.type === 'CGST_SGST') {
    doc.text(`CGST (${(order.gst.rate / 2).toFixed(2)}%): Rs. ${order.gst.cgstAmount}`);
    doc.text(`SGST (${(order.gst.rate / 2).toFixed(2)}%): Rs. ${order.gst.sgstAmount}`);
  } else {
    doc.text(`IGST (${order.gst.rate}%): Rs. ${order.gst.igstAmount}`);
  }
  doc.text(`Delivery Charge: Rs. ${order.deliveryCharge}`);
  if (order.couponDiscount) doc.text(`Coupon Discount (${order.couponCode}): -Rs. ${order.couponDiscount}`);
  doc.fontSize(12).text(`Total Paid (COD): Rs. ${order.totalPayable}`, { underline: true });

  doc.end();

  // In production, upload to S3/Cloud Storage and return the public URL.
  return { url: `/invoices/${order.orderId}.pdf`, filePath };
}

module.exports = { generateInvoicePdf };
