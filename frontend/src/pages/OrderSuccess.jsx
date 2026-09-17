import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();

  return (
    <div 
      style={{ 
        minHeight: '75vh', 
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
        {/* Success Icon Badge */}
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
          🎉
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
          Confirmed
        </span>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 12px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Order Placed Successfully
        </h2>
        
        {state?.orderId && (
          <div style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', borderRadius: 12, padding: '10px 16px', marginBottom: 16, fontSize: 14, color: '#555555' }}>
            Your Order ID: <strong style={{ color: '#2D2D2D' }}>{state.orderId}</strong>
          </div>
        )}

        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.5 }}>
          You'll see full order details and the GST invoice here once your order is delivered.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              flex: 1,
              backgroundColor: '#8B9A6E',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.5px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
              boxSizing: 'border-box',
              transition: 'background 0.2s ease',
              display: 'inline-block'
            }}
          >
            Home
          </Link>
          <Link 
            to="/" 
            style={{ 
              flex: 1,
              backgroundColor: '#F7F2EB',
              color: '#2D2D2D',
              border: '1px solid #EAE2D6',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.5px',
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background 0.2s ease',
              display: 'inline-block'
            }}
          >
            Buy More
          </Link>
        </div>

      </div>
    </div>
  );
}