import { useState } from 'react';

const BADGES = [
  { 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ), 
    title: 'Fast Delivery', 
    text: 'Delivered across India' 
  },
  { 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ), 
    title: 'Secure Checkout', 
    text: 'Cash on Delivery, no card details needed' 
  },
  { 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 14 4 9 9 4"></polyline>
        <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
      </svg>
    ), 
    title: 'Easy Returns', 
    text: 'Hassle-free return policy' 
  },
  { 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ), 
    title: 'Quality Guaranteed', 
    text: 'Checked before dispatch' 
  },
];

export default function TrustBadges() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        margin: '36px 0',
        fontFamily: 'sans-serif',
      }}
    >
      {BADGES.map((b) => (
        <BadgeCard key={b.title} badge={b} />
      ))}
    </div>
  );
}

function BadgeCard({ badge }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAE2D6',
        borderRadius: 14,
        padding: '20px 16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: hovered ? '0 6px 16px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Icon Circle */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#F7F2EB',
          border: '1px solid #EAE2D6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        {badge.icon}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          color: '#2D2D2D',
          marginBottom: 4,
        }}
      >
        {badge.title}
      </div>

      <div
        style={{
          fontSize: 12,
          color: '#666666',
          lineHeight: 1.4,
          maxWidth: 180,
        }}
      >
        {badge.text}
      </div>
    </div>
  );
}