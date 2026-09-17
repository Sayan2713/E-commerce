import { useEffect, useState } from 'react';
import api from '../api/client';

function formatCount(n) {
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
  return `${n}+`;
}

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get('/stats')
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  // Early stage check to preserve brand trust
  const isEarlyStage = stats.customerCount < 50;

  if (isEarlyStage) {
    return (
      <div
        style={{
          marginTop: 48,
          padding: '40px 24px',
          borderRadius: 16,
          backgroundColor: '#8B9A6E',
          color: '#FFFFFF',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 16px rgba(139, 154, 110, 0.2)',
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
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
          Our Journey
        </span>

        <h3 style={{ margin: '0 0 8px 0', fontSize: 22, fontWeight: 700 }}>
          Be Among Our First Customers
        </h3>

        <p
          style={{
            opacity: 0.95,
            maxWidth: 440,
            margin: '0 auto',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          We&apos;re just getting started—every early order and review helps us
          grow, and we read every single piece of feedback personally.
        </p>
      </div>
    );
  }

  const items = [
    { value: formatCount(stats.customerCount), label: 'Happy Customers' },
    stats.positiveReviewPercent != null && {
      value: `${stats.positiveReviewPercent}%`,
      label: 'Positive Reviews',
    },
    { value: formatCount(stats.deliveredOrderCount), label: 'Orders Delivered' },
  ].filter(Boolean);

  return (
    <div
      style={{
        marginTop: 48,
        padding: '36px 24px',
        borderRadius: 16,
        backgroundColor: '#8B9A6E',
        color: '#FFFFFF',
        fontFamily: 'sans-serif',
        boxShadow: '0 4px 16px rgba(139, 154, 110, 0.2)',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 24,
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.3px',
        }}
      >
        Why Customers Love Us
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: 16,
          textAlign: 'center',
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '16px 12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px' }}>
              {item.value}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, fontWeight: 500 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}