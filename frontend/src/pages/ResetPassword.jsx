import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, token, newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed - the link may have expired');
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

  if (!token || !email) {
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
              width: 56, height: 56, background: '#FDF2F2', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto', fontSize: 24, border: '1px solid #F8B4B4'
            }}
          >
            ⚠️
          </div>
          <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Invalid Link
          </h2>
          <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.5 }}>
            This password reset link is missing required information.
          </p>
          <Link 
            to="/forgot-password" 
            style={{ 
              display: 'inline-block', width: '100%', backgroundColor: '#8B9A6E', color: '#FFFFFF',
              padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)', boxSizing: 'border-box'
            }}
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
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
              width: 56, height: 56, background: '#F7F2EB', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto', fontSize: 24, border: '1px solid #EAE2D6'
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Password Reset
          </h2>
          <p style={{ color: '#666666', fontSize: 14, margin: 0 }}>
            Redirecting you to login...
          </p>
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
            width: 56, height: 56, background: '#F7F2EB', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto', fontSize: 24, border: '1px solid #EAE2D6'
          }}
        >
          🔑
        </div>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Set a New Password
        </h2>
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.4 }}>
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' }}>
          <div>
            <label htmlFor="newPassword" style={labelStyle}>New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div 
              style={{ 
                color: '#9B1C1C', background: '#FDF2F2', padding: '10px 14px', 
                borderRadius: 10, fontSize: 13, border: '1px solid #F8B4B4' 
              }} 
              role="alert"
            >
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: loading ? '#C4CBB7' : '#8B9A6E', 
              color: '#FFFFFF', 
              padding: '14px 24px', 
              border: 'none', 
              borderRadius: 12, 
              fontSize: 15, 
              fontWeight: 800, 
              letterSpacing: '0.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
              transition: 'background 0.2s ease',
              marginTop: 4
            }}
          >
            {loading ? 'Updating...' : 'Reset Password'}
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