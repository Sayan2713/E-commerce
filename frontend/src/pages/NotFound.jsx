import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div 
      style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 16px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{ 
          maxWidth: 440, 
          width: '100%', 
          background: '#FFFFFF', 
          border: '1px solid #EAE2D6', 
          borderRadius: 24, 
          padding: '48px 32px', 
          boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
          textAlign: 'center'
        }}
      >
        {/* Icon / Badge */}
        <div 
          style={{ 
            width: 64, 
            height: 64, 
            background: '#F7F2EB', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: 28,
            border: '1px solid #EAE2D6'
          }}
        >
          🔍
        </div>

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
            display: 'inline-block',
            marginBottom: 12,
          }}
        >
          Error 404
        </span>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Page not found
        </h2>
        
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 32px 0', lineHeight: 1.5 }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link 
          to="/" 
          style={{ 
            display: 'inline-block', 
            width: '100%',
            backgroundColor: '#8B9A6E',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
            boxSizing: 'border-box',
            transition: 'background 0.2s ease',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}