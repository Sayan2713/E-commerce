import LegalDocument from '../components/LegalDocument';

// Draft based on standard Indian apparel-e-commerce practice - not legal
// advice. Adjust the return window, conditions, and process to match your
// actual operations before launch.
export default function ReturnPolicy() {
  const sectionHeadingStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: '#2D2D2D',
    marginTop: 28,
    marginBottom: 10,
    letterSpacing: '-0.3px',
    borderBottom: '1px dashed #EAE2D6',
    paddingBottom: 6,
  };

  const paragraphStyle = {
    color: '#666666',
    lineHeight: 1.65,
    margin: '0 0 16px 0',
  };

  const listStyle = {
    margin: '0 0 16px 0',
    paddingLeft: 20,
    color: '#666666',
    lineHeight: 1.65,
  };

  const listItemStyle = {
    marginBottom: 8,
  };

  return (
    <LegalDocument title="Return Policy" lastUpdated="September 2026">
      <h3 style={sectionHeadingStyle}>1. Return Window</h3>
      <p style={paragraphStyle}>
        You can request a return within 7 days of delivery for most items,
        as long as the conditions below are met. To start a return, go to
        your Order History and select &quot;Return this item,&quot; or contact us at
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT EMAIL] </span> /
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT PHONE] </span>
        with your Order ID.
      </p>

      <h3 style={sectionHeadingStyle}>2. Conditions for Return</h3>
      <ul style={listStyle}>
        <li style={listItemStyle}>The item must be unused, unwashed, and unaltered, with all original tags attached.</li>
        <li style={listItemStyle}>The item must be returned in its original packaging.</li>
        <li style={listItemStyle}>Innerwear, undergarments, and any items marked &quot;Non-Returnable&quot; on the product page cannot be returned for hygiene reasons.</li>
        <li style={listItemStyle}>Items purchased during clearance or final sale may not be eligible for return—this will be noted clearly on the product page.</li>
      </ul>

      <h3 style={sectionHeadingStyle}>3. How Returns Work (COD Orders)</h3>
      <p style={paragraphStyle}>
        Since we currently primary accept Cash on Delivery, refunds for approved
        returns are issued to your bank account via direct transfer or UPI
        (details collected at the time of return request) rather than to a original card.
        Refunds are processed within 7–10 business days of us receiving and inspecting
        the returned item.
      </p>

      <h3 style={sectionHeadingStyle}>4. Exchanges</h3>
      <p style={paragraphStyle}>
        If you need a different size, request an exchange instead of a
        return from your Order History. Exchanges are subject to stock
        availability of the requested size.
      </p>

      <h3 style={sectionHeadingStyle}>5. Damaged, Defective, or Wrong Items</h3>
      <p style={paragraphStyle}>
        If you receive a damaged, defective, or incorrect item, please
        contact us within 48 hours of delivery with photos of the item and
        packaging. We will arrange a free pickup and full refund or replacement—no
        questions asked.
      </p>

      <h3 style={sectionHeadingStyle}>6. Order Cancellations</h3>
      <p style={paragraphStyle}>
        Since all orders are COD, you can cancel an order any time before it
        is marked &quot;Shipped&quot; from your Order History, at no charge. Orders
        already shipped cannot be cancelled but can be returned once
        delivered, per the policy above.
      </p>

      <h3 style={sectionHeadingStyle}>7. Return Pickup / Drop-off</h3>
      <p style={paragraphStyle}>
        Depending on your location, we will either arrange a reverse pickup or
        ask you to ship the item back to us. Return shipping is free for
        defective/wrong items; for other returns, a nominal return shipping fee
        may apply and will be deducted from your refund total.
      </p>

      <h3 style={sectionHeadingStyle}>8. Questions</h3>
      <p style={{ ...paragraphStyle, marginBottom: 0 }}>
        For anything not covered here, reach out to
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT EMAIL] </span> or
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT PHONE] </span>
        and we will sort it out.
      </p>
    </LegalDocument>
  );
}