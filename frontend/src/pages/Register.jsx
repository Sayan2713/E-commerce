import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { validateRegisterForm } from '../utils/validators';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    referralCode: searchParams.get('ref') || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRegisterForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #EAE2D6',
          borderRadius: 24,
          padding: '40px 32px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
          textAlign: 'center',
        }}
      >
        {/* Header Badge */}
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
            border: '1px solid #EAE2D6',
          }}
        >
          ✨
        </div>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Create Account
        </h2>
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.4 }}>
          Join ClothStore for seamless shopping and order tracking.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div>
            <label htmlFor="name" style={labelStyle}>Full Name *</label>
            <input
              id="name"
              placeholder="e.g. Sayan Mondal"
              value={form.name}
              onChange={set('name')}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {/* Mobile & Email Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div>
              <label htmlFor="mobile" style={labelStyle}>Mobile Number *</label>
              <input
                id="mobile"
                placeholder="10-digit number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                maxLength={10}
                disabled={loading}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}>Email (Optional)</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={set('email')}
                disabled={loading}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Date of Birth & Referral Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div>
              <label htmlFor="dob" style={labelStyle}>Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={form.dob}
                onChange={set('dob')}
                disabled={loading}
                style={{
                  ...inputStyle,
                  color: form.dob ? '#2D2D2D' : '#999999',
                  fontFamily: 'sans-serif',
                }}
              />
            </div>
            <div>
              <label htmlFor="referralCode" style={labelStyle}>Referral Code</label>
              <input
                id="referralCode"
                placeholder="Optional"
                value={form.referralCode}
                onChange={set('referralCode')}
                disabled={loading}
                style={{ ...inputStyle, textTransform: 'uppercase' }}
              />
            </div>
          </div>

          {/* Password Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div>
              <label htmlFor="password" style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password"
                  value={form.password}
                  onChange={set('password')}
                  disabled={loading}
                  required
                  style={{ ...inputStyle, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888888',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  disabled={loading}
                  required
                  style={{ ...inputStyle, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888888',
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
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
                textAlign: 'left',
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
              marginTop: 6,
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
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
            letterSpacing: '1px',
          }}
        >
          <div style={{ flex: 1, borderBottom: '1px solid #EAE2D6' }} />
          <span style={{ padding: '0 12px' }}>OR</span>
          <div style={{ flex: 1, borderBottom: '1px solid #EAE2D6' }} />
        </div>

        {/* Third-party Login */}
        <GoogleLoginButton />

        <div style={{ marginTop: 24, fontSize: 14, color: '#666666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#8B9A6E', fontWeight: 800, textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}