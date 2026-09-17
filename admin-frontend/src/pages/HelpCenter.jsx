import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function HelpCenter() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('OPEN');

  const load = () => adminApi.get('/support-messages', { params: filter ? { status: filter } : {} }).then((r) => setMessages(r.data.messages));
  useEffect(() => { load(); }, [filter]);

  const markResolved = async (id) => {
    await adminApi.patch(`/support-messages/${id}`, { status: 'RESOLVED' });
    load();
  };

  return (
    <div>
      <h2>Help Center</h2>
      <p style={{ fontSize: 13, color: '#777' }}>Messages submitted through the site's Contact Us / Help Center form.</p>

      <div style={{ marginBottom: 12 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
          <option value="">All</option>
        </select>
      </div>

      {messages.length === 0 && <div style={{ color: '#777' }}>No messages here.</div>}
      {messages.map((m) => (
        <div key={m._id} className="card" style={{ background: 'white', padding: 16, borderRadius: 8, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{m.name}</strong>
            <span style={{ fontSize: 12, color: '#777' }}>{new Date(m.createdAt).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 13, color: '#777' }}>{m.email}{m.phone ? ` - ${m.phone}` : ''}</div>
          {m.subject && <div style={{ fontWeight: 600, marginTop: 6 }}>{m.subject}</div>}
          <p style={{ marginTop: 6 }}>{m.message}</p>
          {m.status === 'OPEN' ? (
            <button onClick={() => markResolved(m._id)}>Mark Resolved</button>
          ) : (
            <span style={{ fontSize: 12, color: 'green' }}>Resolved</span>
          )}
        </div>
      ))}
    </div>
  );
}
