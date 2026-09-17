import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DeleteAccount({ hasPassword }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const confirmDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await api.delete('/users/me', { data: { password: password || 'google-account' } });
      await logout();
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Could not delete account');
    } finally {
      setDeleting(false);
    }
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#D9534F';
    e.target.style.backgroundColor = '#FFFFFF';
    e.target.style.boxShadow = '0 0 0 3px rgba(217, 83, 79, 0.15)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#EAE2D6';
    e.target.style.backgroundColor = '#F7F2EB';
    e.target.style.boxShadow = 'none';
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          marginTop: 16,
          background: 'transparent',
          border: 'none',
          color: '#D9534F',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          padding: 0,
          textDecoration: 'underline',
        }}
      >
        Delete my account
      </button>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 24,
        borderRadius: 12,
        background: '#FFF5F5',
        border: '1px solid #F5C6CB',
        boxShadow: '0 2px 8px rgba(217, 83, 79, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <h4 style={{ margin: 0, color: '#D9534F', fontSize: 16, fontWeight: 700 }}>
          Delete Account Warning
        </h4>
      </div>

      <p style={{ margin: '0 0 16px 0', color: '#666666', fontSize: 13, lineHeight: 1.6 }}>
        This permanently removes your profile, saved addresses, and saved items. Your past orders are kept for tax/accounting records as required by law, but are no longer linked to an active account. <strong>This action cannot be undone.</strong>
      </p>

      {hasPassword && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#2D2D2D', marginBottom: 6, letterSpacing: '0.5px' }}>
            CONFIRM YOUR PASSWORD *
          </label>
          <input
            type="password"
            placeholder="Enter your current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #EAE2D6',
              backgroundColor: '#F7F2EB',
              color: '#2D2D2D',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
          />
        </div>
      )}

      {error && (
        <div style={{ color: '#D9534F', fontSize: 13, background: '#FFFFFF', padding: '8px 12px', borderRadius: 6, border: '1px solid #F5C6CB', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={confirmDelete}
          disabled={deleting || (hasPassword && !password)}
          style={{
            background: deleting || (hasPassword && !password) ? '#E5999B' : '#D9534F',
            color: '#FFFFFF',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: deleting || (hasPassword && !password) ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {deleting ? 'Deleting Account...' : 'Yes, Permanently Delete My Account'}
        </button>

        <button
          onClick={() => {
            setOpen(false);
            setError('');
            setPassword('');
          }}
          style={{
            background: '#FFFFFF',
            color: '#2D2D2D',
            border: '1px solid #EAE2D6',
            padding: '10px 20px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}