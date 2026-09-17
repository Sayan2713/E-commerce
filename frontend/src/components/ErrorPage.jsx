import { useState } from 'react';

export default function ErrorPage({ onRetry }) {
  const [hoverReload, setHoverReload] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F7F2EB',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EAE2D6',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        {/* Warning Icon Badge */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#FFF5F5',
            border: '1px solid #F5C6CB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: 24,
          }}
        >
          ⚠️
        </div>

        {/* Category Pill */}
        <span
          style={{
            background: '#EAE2D6',
            color: '#8B9A6E',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Unexpected Error
        </span>

        <h2
          style={{
            fontSize: 24,
            color: '#2D2D2D',
            marginTop: 16,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          Something Went Wrong
        </h2>

        <p
          style={{
            color: '#666666',
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 auto 28px auto',
            maxWidth: 340,
          }}
        >
          An unexpected error occurred while rendering this page. Try reloading—if this keeps happening, feel free to reach out to our team.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onRetry || (() => window.location.reload())}
            onMouseEnter={() => setHoverReload(true)}
            onMouseLeave={() => setHoverReload(false)}
            style={{
              backgroundColor: hoverReload ? '#7A895E' : '#8B9A6E',
              color: '#FFFFFF',
              padding: '12px 24px',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'background 0.2s ease',
            }}
          >
            Reload Page
          </button>

          <a
            href="/contact"
            onMouseEnter={() => setHoverContact(true)}
            onMouseLeave={() => setHoverContact(false)}
            style={{
              display: 'inline-block',
              backgroundColor: hoverContact ? '#F7F2EB' : '#FFFFFF',
              color: '#2D2D2D',
              border: '1px solid #EAE2D6',
              padding: '12px 24px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}