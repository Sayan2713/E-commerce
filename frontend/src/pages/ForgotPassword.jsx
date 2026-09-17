import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError('Please enter your email or mobile number.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { identifier: cleanIdentifier });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: '1px solid #EAE2D6',
    backgroundColor: '#F7F2EB',
    color: '#2D2D2D',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#8B9A6E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left',
  };

  if (sent) {
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
            maxWidth: 420, 
            width: '100%', 
            background: '#FFFFFF', 
            border: '1px solid #EAE2D6', 
            borderRadius: 24, 
            padding: '40px 32px', 
            boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
            textAlign: 'center'
          }}
        >
          <div 
            style={{ 
              width: 56, 
              height: 56, 
              background: '#F7F2EB', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: 24,
              border: '1px solid #EAE2D6'
            }}
          >
            ✉️
          </div>

          <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Check your email
          </h2>
          <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.5 }}>
            If an account exists for that entry, we've sent a password reset link. It expires in 1 hour.
          </p>

          <Link 
            to="/login" 
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
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

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
          maxWidth: 420, 
          width: '100%', 
          background: '#FFFFFF', 
          border: '1px solid #EAE2D6', 
          borderRadius: 24, 
          padding: '40px 32px', 
          boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
          textAlign: 'center'
        }}
      >
        <div 
          style={{ 
            width: 56, 
            height: 56, 
            background: '#F7F2EB', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: 24,
            border: '1px solid #EAE2D6'
          }}
        >
          🔒
        </div>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Forgot Password
        </h2>
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.4 }}>
          Enter your mobile number or email and we'll send a reset link to your registered email.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' }}>
          <div>
            <label htmlFor="identifier" style={labelStyle}>
              Mobile number or Email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="e.g. name@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              required
              aria-required="true"
              style={inputStyle}
            />
          </div>

          {error && (
            <div 
              style={{ 
                color: '#9B1C1C', 
                background: '#FDF2F2', 
                padding: '10px 14px', 
                borderRadius: 10, 
                fontSize: 13, 
                border: '1px solid #F8B4B4' 
              }} 
              role="alert"
            >
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !identifier.trim()}
            style={{ 
              width: '100%', 
              backgroundColor: (loading || !identifier.trim()) ? '#C4CBB7' : '#8B9A6E', 
              color: '#FFFFFF', 
              padding: '14px 24px', 
              border: 'none', 
              borderRadius: 12, 
              fontSize: 15, 
              fontWeight: 800, 
              letterSpacing: '0.5px',
              cursor: (loading || !identifier.trim()) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
              transition: 'background 0.2s ease',
              marginTop: 4
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 14 }}>
          <Link to="/login" style={{ color: '#8B9A6E', fontWeight: 700, textDecoration: 'none' }}>
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}