import LegalDocument from '../components/LegalDocument';

export default function CancellationPolicy() {
  const sectionHeadingStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: '#2D2D2D',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: '-0.3px',
  };

  const paragraphStyle = {
    color: '#666666',
    lineHeight: 1.65,
    margin: '0 0 16px 0',
  };

  return (
    <LegalDocument title="Cancellation Policy" lastUpdated="September 2026">
      <h3 style={sectionHeadingStyle}>1. Cancelling Before Shipping</h3>
      <p style={paragraphStyle}>
        You can cancel any order, at no charge, any time before it is marked
        &quot;Shipped.&quot; Go to your Order History and select &quot;Cancel Order&quot;—the
        cancellation is immediate and any reserved stock is released back
        into inventory right away.
      </p>

      <h3 style={sectionHeadingStyle}>2. Non-Cancellable Items</h3>
      <p style={paragraphStyle}>
        Some items—typically clearance, made-to-order, or hygiene-sensitive
        products—may be marked non-cancellable. This will be clear on the
        product page before you buy, and the Cancel Order option simply
        won&apos;t be available for that order once placed.
      </p>

      <h3 style={sectionHeadingStyle}>3. After an Order Has Shipped</h3>
      <p style={paragraphStyle}>
        Once an order is marked &quot;Shipped,&quot; it can no longer be cancelled—at
        that point, you can request a return once the item is delivered
        to you, subject to our Return Policy.
      </p>

      <h3 style={sectionHeadingStyle}>4. Order Cancelled by Us</h3>
      <p style={paragraphStyle}>
        In rare cases we may need to cancel an order ourselves—for example,
        if an item unexpectedly goes out of stock, or if we are unable to
        deliver to your address. We will let you know if this happens; since
        all orders are Cash on Delivery, no charge is ever made for a
        cancelled order.
      </p>

      <h3 style={sectionHeadingStyle}>5. Questions</h3>
      <p style={paragraphStyle}>
        For anything not covered here, reach out via our Contact Us / Help
        Center page.
      </p>
    </LegalDocument>
  );
}