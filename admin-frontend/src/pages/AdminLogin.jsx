import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../api/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminApi.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminRole', data.admin.role);
      localStorage.setItem('adminName', data.admin.name || '');
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{ fontSize: 12, color: '#777' }}>
        First run? Create the super admin via: <code>node src/seedAdmin.js "Name" email password</code> in admin-backend.
      </p>
    </div>
  );
}
