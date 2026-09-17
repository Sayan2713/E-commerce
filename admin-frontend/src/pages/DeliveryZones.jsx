import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function DeliveryZones() {
  const [config, setConfig] = useState(null);
  const [stateForm, setStateForm] = useState({ state: '', zoneLabel: '', rate: '' });
  const [editingOriginalState, setEditingOriginalState] = useState(null); // tracks whether we're editing vs adding new

  const load = () => adminApi.get('/config/delivery-config').then((r) => setConfig(r.data.config));
  useEffect(() => { load(); }, []);

  const saveStateRate = async (e) => {
    e.preventDefault();
    // If the state name changed while editing, remove the old entry first
    // so you don't end up with both the old and new state name in the list.
    if (editingOriginalState && editingOriginalState !== stateForm.state) {
      await adminApi.delete(`/config/delivery-config/state-rate/${encodeURIComponent(editingOriginalState)}`);
    }
    await adminApi.put('/config/delivery-config/state-rate', {
      state: stateForm.state, zoneLabel: stateForm.zoneLabel, rate: Number(stateForm.rate),
    });
    setStateForm({ state: '', zoneLabel: '', rate: '' });
    setEditingOriginalState(null);
    load();
  };

  const startEdit = (s) => {
    setStateForm({ state: s.state, zoneLabel: s.zoneLabel || '', rate: s.rate });
    setEditingOriginalState(s.state);
  };

  const cancelEdit = () => {
    setStateForm({ state: '', zoneLabel: '', rate: '' });
    setEditingOriginalState(null);
  };

  const deleteStateRate = async (state) => {
    if (!window.confirm(`Remove the delivery rate for ${state}?`)) return;
    await adminApi.delete(`/config/delivery-config/state-rate/${encodeURIComponent(state)}`);
    load();
  };

  if (!config) return null;

  return (
    <div>
      <h2>Delivery Zones</h2>
      <p>Home state (intra-state GST applies): <strong>{config.homeState}</strong></p>

      <h4>{editingOriginalState ? `Editing: ${editingOriginalState}` : 'Add State Rate'}</h4>
      <form onSubmit={saveStateRate} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="State (e.g. West Bengal)" value={stateForm.state} onChange={(e) => setStateForm({ ...stateForm, state: e.target.value })} required />
        <input placeholder="Zone label (e.g. Regional)" value={stateForm.zoneLabel} onChange={(e) => setStateForm({ ...stateForm, zoneLabel: e.target.value })} />
        <input placeholder="Rate (Rs.)" type="number" value={stateForm.rate} onChange={(e) => setStateForm({ ...stateForm, rate: e.target.value })} required />
        <button type="submit">{editingOriginalState ? 'Save Changes' : 'Add'}</button>
        {editingOriginalState && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>
      <table width="100%" cellPadding={6} style={{ background: 'white' }}>
        <thead><tr><th align="left">State</th><th align="left">Zone</th><th align="left">Rate</th><th></th></tr></thead>
        <tbody>
          {config.stateRates.map((s) => (
            <tr key={s.state}>
              <td>{s.state}</td>
              <td>{s.zoneLabel}</td>
              <td>Rs. {s.rate}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button onClick={() => startEdit(s)} style={{ marginRight: 6 }}>Edit</button>
                <button onClick={() => deleteStateRate(s.state)} style={{ color: '#c0392b' }}>Delete</button>
              </td>
            </tr>
          ))}
          {config.stateRates.length === 0 && (
            <tr><td colSpan={4} style={{ color: '#777' }}>No state rates configured yet.</td></tr>
          )}
        </tbody>
      </table>

      <h4 style={{ marginTop: 24 }}>Fallback Distance Tiers (for unmapped PIN codes/states)</h4>
      <table width="100%" cellPadding={6} style={{ background: 'white' }}>
        <thead><tr><th align="left">Label</th><th align="left">Up to (km)</th><th align="left">Rate</th></tr></thead>
        <tbody>
          {config.fallbackTiers.map((t, i) => (
            <tr key={i}><td>{t.label}</td><td>{t.maxDistanceKm ?? 'No limit'}</td><td>Rs. {t.rate}</td></tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: '#777' }}>
        Example defaults to seed: Local/Jharkhand Rs.40, Regional Rs.70, National Rs.120.
        Edit fallback tiers directly via the config API for now (bulk editor can be added later).
      </p>
    </div>
  );
}
