import LegalDocument from '../components/LegalDocument';

// IMPORTANT: Google Play (and Apple) require your published Privacy Policy
// to accurately describe what you actually collect - it's cross-checked
// against your Play Console "Data Safety" form. This draft is written to
// match what THIS codebase collects as of the current build. If you add or
// remove any data collection (new signup fields, new analytics/ad SDKs,
// etc.), update this page AND your Data Safety form together, or your app
// can get rejected/suspended for a mismatch. Still have a lawyer review
// before launch - this isn't legal advice.
export default function PrivacyPolicy() {
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
    <LegalDocument title="Privacy Policy" lastUpdated="September 2026">
      <p style={paragraphStyle}>
        This Privacy Policy explains what personal information [BUSINESS NAME]
        (&quot;we&quot;, &quot;us&quot;) collects through the [BUSINESS NAME] website and mobile
        app (the &quot;Platform&quot;), how we use it, and the choices you have.
      </p>

      <h3 style={sectionHeadingStyle}>1. Information We Collect</h3>
      <p style={{ ...paragraphStyle, marginBottom: 8, fontWeight: 700, color: '#2D2D2D' }}>
        Information you give us directly:
      </p>
      <ul style={listStyle}>
        <li style={listItemStyle}>Account details: name, mobile number, email address, date of birth, and password (we store only a securely hashed version of your password, never plain text).</li>
        <li style={listItemStyle}>Delivery addresses: full name, phone number, address, city, state, and PIN code for each saved address.</li>
        <li style={listItemStyle}>Profile picture, if you choose to upload one.</li>
        <li style={listItemStyle}>Order details: items purchased, sizes, order value, and delivery address for each order.</li>
        <li style={listItemStyle}>Product reviews and ratings you submit.</li>
        <li style={listItemStyle}>Anything you send us directly, e.g. via our Contact Us page or customer support.</li>
      </ul>

      <p style={{ ...paragraphStyle, marginBottom: 8, fontWeight: 700, color: '#2D2D2D' }}>
        Information we collect automatically:
      </p>
      <ul style={listStyle}>
        <li style={listItemStyle}>Device and session information: IP address, browser/device type, and a device label—used to keep your account secure (for example, showing you which devices are logged in and letting you log out of unrecognized devices).</li>
        <li style={listItemStyle}>On the mobile app, a push notification token (used only to send you order status updates like &quot;Shipped&quot; or &quot;Out for delivery&quot;).</li>
      </ul>

      <p style={{ ...paragraphStyle, marginBottom: 8, fontWeight: 700, color: '#2D2D2D' }}>
        Information from third parties (only if you use these features):
      </p>
      <ul style={listStyle}>
        <li style={listItemStyle}>If you sign in with Google, we receive your name, email address, and profile picture from Google.</li>
      </ul>

      <h3 style={sectionHeadingStyle}>2. How We Use Your Information</h3>
      <ul style={listStyle}>
        <li style={listItemStyle}>To create and manage your account, and let you log in securely.</li>
        <li style={listItemStyle}>To process and deliver your orders, including calculating applicable delivery charges and GST.</li>
        <li style={listItemStyle}>To send order status updates (via email, and via push notification if enabled on the app).</li>
        <li style={listItemStyle}>To let you save addresses, save items, and view your order history for future orders.</li>
        <li style={listItemStyle}>To send password-reset emails when you request one.</li>
        <li style={listItemStyle}>To detect and prevent fraud, abuse, and unauthorized account access.</li>
        <li style={listItemStyle}>To respond to your questions or support requests.</li>
      </ul>
      <p style={paragraphStyle}>
        We do not sell your personal information to third parties, and we do
        not use your data for third-party advertising.
      </p>

      <h3 style={sectionHeadingStyle}>3. Who We Share Information With</h3>
      <p style={paragraphStyle}>
        We share limited data with service providers who help us run the Platform, strictly to provide their service to us:
      </p>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong style={{ color: '#2D2D2D' }}>Cloudinary</strong>—stores product, banner, and profile images you or our admin team upload.</li>
        <li style={listItemStyle}><strong style={{ color: '#2D2D2D' }}>SendGrid</strong>—sends transactional emails (such as password reset links) on our behalf.</li>
        <li style={listItemStyle}><strong style={{ color: '#2D2D2D' }}>Google</strong>—if you use &quot;Sign in with Google.&quot;</li>
        <li style={listItemStyle}><strong style={{ color: '#2D2D2D' }}>Expo</strong>—delivers push notifications to the mobile app.</li>
        <li style={listItemStyle}><strong style={{ color: '#2D2D2D' }}>Delivery/Logistics Partners</strong>—receive your name, phone number, and delivery address to fulfill your order.</li>
      </ul>
      <p style={paragraphStyle}>
        We may also disclose information if required by law, or to protect
        the rights, property, or safety of [BUSINESS NAME], our users, or the
        public.
      </p>

      <h3 style={sectionHeadingStyle}>4. Data Retention</h3>
      <p style={paragraphStyle}>
        We keep your account and order information for as long as your
        account is active, and for a reasonable period afterward as needed
        for accounting, tax (GST), and legal record-keeping requirements.
        Login session records are automatically deleted after they expire
        (currently, sessions expire after 1 year of inactivity).
      </p>

      <h3 style={sectionHeadingStyle}>5. Your Choices & Rights</h3>
      <ul style={listStyle}>
        <li style={listItemStyle}>You can view and update your profile, addresses, and saved items any time from your account.</li>
        <li style={listItemStyle}>You can log out of one device, or all devices at once, from Profile settings.</li>
        <li style={listItemStyle}>You can request that we delete your account and associated personal data, subject to our legal obligation to retain order/tax records for a required period, by contacting [SUPPORT EMAIL].</li>
        <li style={listItemStyle}>You can opt out of push notifications at any time from your device&apos;s notification settings.</li>
      </ul>

      <h3 style={sectionHeadingStyle}>6. Data Security</h3>
      <p style={paragraphStyle}>
        We use industry-standard measures to protect your data, including
        encrypted password storage, hashed session tokens, and rate-limiting
        on login and account-recovery endpoints. No method of transmission
        or storage is 100% secure, but we work to protect your information
        appropriately.
      </p>

      <h3 style={sectionHeadingStyle}>7. Children&apos;s Privacy</h3>
      <p style={paragraphStyle}>
        The Platform is not directed at children under 18. We do not
        knowingly collect personal information from children.
      </p>

      <h3 style={sectionHeadingStyle}>8. Changes to This Policy</h3>
      <p style={paragraphStyle}>
        We may update this Privacy Policy from time to time. We will update the
        &quot;Last updated&quot; date above when we do, and material changes will be
        highlighted on the Platform.
      </p>

      <h3 style={sectionHeadingStyle}>9. Contact Us</h3>
      <p style={{ ...paragraphStyle, marginBottom: 0 }}>
        For any privacy questions or requests, contact us at
        <span style={{ color: '#8B9A6E', fontWeight: 600 }}> [SUPPORT EMAIL] </span>
        or [REGISTERED ADDRESS].
      </p>
    </LegalDocument>
  );
}