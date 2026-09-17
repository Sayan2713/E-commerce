export default function Careers() {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '32px 20px 60px 20px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EAE2D6',
          padding: '40px 32px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid #EAE2D6', paddingBottom: 20, marginBottom: 28 }}>
          <span
            style={{
              backgroundColor: '#F7F2EB',
              color: '#8B9A6E',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: 12,
            }}
          >
            Join Our Team
          </span>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#2D2D2D',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Careers
          </h1>

          <div style={{ color: '#666666', fontSize: 14, fontWeight: 500 }}>
            Build the future of boutique e-commerce with us.
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            lineHeight: 1.7,
            fontSize: 15,
            color: '#666666',
          }}
        >
          <p style={{ margin: '0 0 24px 0' }}>
            We are a small, passionate, and growing team dedicated to delivering high-quality products and seamless experiences. While we do not have any open positions listed right now, we are always eager to connect with talented individuals.
          </p>

          {/* Contact Highlight Box */}
          <div
            style={{
              backgroundColor: '#F7F2EB',
              border: '1px solid #EAE2D6',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#2D2D2D',
                margin: '0 0 8px 0',
              }}
            >
              Interested in working with us?
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: 14 }}>
              If you feel your skills and values align with our mission, reach out through our Contact Us page and tell us a bit about yourself and your background.
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-block',
                backgroundColor: '#8B9A6E',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}