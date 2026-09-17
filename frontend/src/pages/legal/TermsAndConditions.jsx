import LegalDocument from '../components/LegalDocument';

// NOTE: This is a reasonable starting draft based on standard Indian
// e-commerce practice, not legal advice. Have a lawyer review before
// launch, and fill in every [BRACKETED] placeholder with your actual
// business details before publishing.
export default function TermsAndConditions() {
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

  const linkStyle = {
    color: '#8B9A6E',
    fontWeight: 600,
    textDecoration: 'underline',
  };

  return (
    <LegalDocument title="Terms & Conditions" lastUpdated="September 2026">
      <p style={paragraphStyle}>
        These Terms & Conditions govern your use of the [BUSINESS NAME] website
        and mobile application (together, the &quot;Platform&quot;) and your purchase of
        products through it. By creating an account, browsing, or placing an
        order, you agree to these Terms.
      </p>

      <h3 style={sectionHeadingStyle}>1. About Us</h3>
      <p style={paragraphStyle}>
        [BUSINESS NAME], registered at [REGISTERED ADDRESS], GSTIN [GSTIN NUMBER],
        operates this Platform. You can reach us at
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT EMAIL] </span> or
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT PHONE]</span>.
      </p>

      <h3 style={sectionHeadingStyle}>2. Eligibility</h3>
      <p style={paragraphStyle}>
        You must be at least 18 years old, or using the Platform under the
        supervision of a parent or guardian, to create an account and place
        orders. You are responsible for keeping your account credentials
        confidential and for all activity under your account.
      </p>

      <h3 style={sectionHeadingStyle}>3. Products & Pricing</h3>
      <p style={paragraphStyle}>
        We try to display product colors, sizes, and details as accurately as
        possible, but slight variations may occur. Prices shown are inclusive
        of applicable GST unless stated otherwise, and are subject to change
        without notice until an order is placed. Delivery charges are shown
        separately at checkout and depend on your delivery location.
      </p>

      <h3 style={sectionHeadingStyle}>4. Orders & Payment</h3>
      <p style={paragraphStyle}>
        Currently, we accept Cash on Delivery (COD) as our primary payment method. Placing an order is
        an offer to buy, which we may accept or decline (for example, if an
        item goes out of stock, if we suspect fraudulent activity, or if the
        delivery address is outside our serviceable areas). An order is
        confirmed only once you receive an order confirmation with an Order ID.
      </p>

      <h3 style={sectionHeadingStyle}>5. Coupons & Discounts</h3>
      <p style={paragraphStyle}>
        Coupon codes are subject to the minimum order value, discount cap, and
        validity period shown at the time of use. We reserve the right to
        modify or withdraw any coupon or offer at any time.
      </p>

      <h3 style={sectionHeadingStyle}>6. Shipping & Delivery</h3>
      <p style={paragraphStyle}>
        Delivery timelines shown on product pages are estimates, not
        guarantees, and may vary based on your location and courier
        availability. Delivery charges are calculated based on your delivery
        pincode/state as shown at checkout.
      </p>

      <h3 style={sectionHeadingStyle}>7. Returns, Refunds & Cancellations</h3>
      <p style={paragraphStyle}>
        See our separate <a href="/policies/return" style={linkStyle}>Return Policy</a> for
        full details on returns, exchanges, and cancellations.
      </p>

      <h3 style={sectionHeadingStyle}>8. User Conduct</h3>
      <p style={paragraphStyle}>
        You agree not to misuse the Platform—including attempting
        unauthorized access to any account or system, submitting false
        reviews, or using the Platform for any unlawful purpose.
      </p>

      <h3 style={sectionHeadingStyle}>9. Intellectual Property</h3>
      <p style={paragraphStyle}>
        All content on the Platform—including logos, product photography,
        and text—belongs to [BUSINESS NAME] or its licensors and may not be
        copied or reused without permission.
      </p>

      <h3 style={sectionHeadingStyle}>10. Limitation of Liability</h3>
      <p style={paragraphStyle}>
        To the extent permitted by law, [BUSINESS NAME] is not liable for
        indirect or consequential losses arising from your use of the
        Platform. Nothing in these Terms limits any right you have under
        applicable consumer protection law.
      </p>

      <h3 style={sectionHeadingStyle}>11. Governing Law</h3>
      <p style={paragraphStyle}>
        These Terms are governed by the laws of India, and any disputes will
        be subject to the exclusive jurisdiction of the courts of
        [CITY, STATE].
      </p>

      <h3 style={sectionHeadingStyle}>12. Changes to These Terms</h3>
      <p style={paragraphStyle}>
        We may update these Terms from time to time. Continued use of the
        Platform after changes are posted means you accept the updated Terms.
      </p>

      <h3 style={sectionHeadingStyle}>13. Contact Us</h3>
      <p style={{ ...paragraphStyle, marginBottom: 0 }}>
        Questions about these Terms? Reach us at
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT EMAIL] </span> or
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT PHONE]</span>.
      </p>
    </LegalDocument>
  );
}