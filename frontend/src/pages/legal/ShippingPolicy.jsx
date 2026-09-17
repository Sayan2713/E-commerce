import LegalDocument from '../components/LegalDocument';

export default function ShippingPolicy() {
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

  return (
    <LegalDocument title="Shipping Policy" lastUpdated="September 2026">
      <h3 style={sectionHeadingStyle}>1. Delivery Areas</h3>
      <p style={paragraphStyle}>
        We currently ship across India. Delivery charges and estimated
        timelines depend on your PIN code and are shown clearly at checkout
        before you place your order.
      </p>

      <h3 style={sectionHeadingStyle}>2. Delivery Charges</h3>
      <p style={paragraphStyle}>
        Delivery charges are calculated based on your delivery location—local
        or regional areas are typically cheaper than distant states. The
        exact charge for your address is always shown before you confirm
        your order, never added as a surprise afterward.
      </p>

      <h3 style={sectionHeadingStyle}>3. Delivery Timelines</h3>
      <p style={paragraphStyle}>
        Most orders are delivered within 4–7 business days of being placed,
        though this can vary based on your location, courier availability,
        and local conditions. Once your order ships, you will be able to track
        it in real time from your Order History.
      </p>

      <h3 style={sectionHeadingStyle}>4. Order Processing</h3>
      <p style={paragraphStyle}>
        Orders are typically packed and handed to our courier partner within
        1–2 business days of being placed. You will see status updates
        (Packed, Shipped, Out for Delivery, Delivered) as your order moves
        through each stage.
      </p>

      <h3 style={sectionHeadingStyle}>5. Delayed or Missing Deliveries</h3>
      <p style={paragraphStyle}>
        If your order is taking longer than expected, check the tracking
        status first—if something still looks wrong, contact us through
        the Help Center and we will look into it.
      </p>

      <h3 style={sectionHeadingStyle}>6. Questions</h3>
      <p style={{ ...paragraphStyle, marginBottom: 0 }}>
        For anything not covered here, reach out via our Contact Us / Help
        Center page.
      </p>
    </LegalDocument>
  );
}