export default function LegalDocument({ title, lastUpdated, children }) {
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
        {/* Document Header */}
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
            Policy & Legal
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
            {title}
          </h1>

          <div style={{ color: '#666666', fontSize: 13, fontWeight: 500 }}>
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Document Body */}
        <div
          style={{
            lineHeight: 1.7,
            fontSize: 15,
            color: '#2D2D2D',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}