import { useState } from 'react';

export default function WhyShopWithUs() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: 48,
        padding: '40px 28px',
        borderRadius: 16,
        backgroundColor: '#F7F2EB',
        border: '1px solid #EAE2D6',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.04)' : '0 2px 10px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Category Tag */}
      <span
        style={{
          backgroundColor: '#FFFFFF',
          color: '#8B9A6E',
          border: '1px solid #EAE2D6',
          padding: '4px 14px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          display: 'inline-block',
          marginBottom: 12,
        }}
      >
        Always Fresh
      </span>

      <h3
        style={{
          margin: '0 0 10px 0',
          fontSize: 22,
          fontWeight: 700,
          color: '#2D2D2D',
          letterSpacing: '-0.3px',
        }}
      >
        New Arrivals Every Week
      </h3>

      <p
        style={{
          color: '#666666',
          fontSize: 14,
          lineHeight: 1.65,
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        We add fresh styles regularly—explore our latest collections or check back soon for seasonal drops. Every order ships with Cash on Delivery and our hassle-free return policy, so you can shop with total peace of mind.
      </p>

      {/* Feature Highlights Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          flexWrap: 'wrap',
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid #EAE2D6',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8B9A6E', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✓ Cash on Delivery
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8B9A6E', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✓ Easy 7-Day Returns
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8B9A6E', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✓ 100% Verified Quality
        </span>
      </div>
    </div>
  );
}