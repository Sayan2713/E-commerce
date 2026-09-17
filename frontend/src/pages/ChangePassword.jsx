import { useState } from 'react';
import api from '../api/client';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setMessage('Password updated. Please log in again on your other devices.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #EAE2D6',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#2D2D2D',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: '0 auto',
        padding: '40px 20px 60px 20px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EAE2D6',
          padding: '36px 32px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Header Section */}
        <div style={{ borderBottom: '1px solid #EAE2D6', paddingBottom: 20, marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#2D2D2D',
              margin: '0 0 6px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Change Password
          </h1>
          <p style={{ color: '#666666', fontSize: 14, margin: 0 }}>
            Ensure your account is using a strong, unique password.
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div
            style={{
              backgroundColor: '#FDF2F2',
              color: '#9B1C1C',
              border: '1px solid #FBD5D5',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              backgroundColor: '#F3F8F2',
              color: '#8B9A6E',
              border: '1px solid #EAE2D6',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#2D2D2D',
                marginBottom: 6,
              }}
            >
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#2D2D2D',
                marginBottom: 6,
              }}
            >
              New Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 8,
              width: '100%',
              backgroundColor: saving ? '#C4CBB7' : '#8B9A6E',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}