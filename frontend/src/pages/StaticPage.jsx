export default function StaticPage({ title, children }) {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Content Card Wrapper */}
      <div 
        style={{ 
          background: '#FFFFFF', 
          border: '1px solid #EAE2D6', 
          borderRadius: 24, 
          padding: '40px 36px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.02)' 
        }}
      >
        {/* Page Title */}
        <h2 
          style={{ 
            fontSize: 28, 
            color: '#2D2D2D', 
            margin: '0 0 20px 0', 
            fontWeight: 800, 
            letterSpacing: '-0.5px',
            borderBottom: '1px solid #EAE2D6',
            paddingBottom: 16
          }}
        >
          {title}
        </h2>

        {/* Content Body */}
        <div 
          style={{ 
            color: '#4A4A4A', 
            fontSize: 15, 
            lineHeight: 1.6, 
            fontWeight: 500 
          }}
        >
          {children || (
            <span style={{ color: '#666666', fontStyle: 'italic' }}>
              Content to be provided by the client.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}