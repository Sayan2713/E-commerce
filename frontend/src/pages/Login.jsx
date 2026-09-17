import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(cleanIdentifier, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Invalid mobile/email or password'
      );
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
        
        {/* Welcome Icon / Badge */}
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
          🌿
        </div>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.4 }}>
          Log in to manage your orders and address details.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          <div>
            <label htmlFor="identifier" style={labelStyle}>
              Mobile number or Email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="e.g. sayanmondal619@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <Link 
                to="/forgot-password" 
                style={{ fontSize: 12, color: '#8B9A6E', fontWeight: 700, textDecoration: 'none', marginBottom: 6 }}
              >
                Forgot?
              </Link>
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  color: '#888888',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div 
              style={{ 
                color: '#9B1C1C', 
                background: '#FDF2F2', 
                padding: '10px 14px', 
                borderRadius: 10, 
                fontSize: 13, 
                border: '1px solid #F8B4B4',
                textAlign: 'left'
              }} 
              role="alert"
            >
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !identifier.trim() || !password}
            style={{ 
              width: '100%', 
              backgroundColor: (loading || !identifier.trim() || !password) ? '#C4CBB7' : '#8B9A6E', 
              color: '#FFFFFF', 
              padding: '14px 24px', 
              border: 'none', 
              borderRadius: 12, 
              fontSize: 15, 
              fontWeight: 800, 
              letterSpacing: '0.5px',
              cursor: (loading || !identifier.trim() || !password) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
              transition: 'background 0.2s ease, transform 0.1s ease',
              marginTop: 4
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '24px 0', 
            color: '#AAAAAA', 
            fontSize: 12, 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          <div style={{ flex: 1, borderBottom: '1px solid #EAE2D6' }} />
          <span style={{ padding: '0 12px' }}>OR</span>
          <div style={{ flex: 1, borderBottom: '1px solid #EAE2D6' }} />
        </div>

        {/* Third-party Login */}
        <GoogleLoginButton />

        <div style={{ marginTop: 28, fontSize: 14, color: '#666666' }}>
          New here?{' '}
          <Link 
            to="/register" 
            style={{ color: '#8B9A6E', fontWeight: 800, textDecoration: 'none' }}
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}