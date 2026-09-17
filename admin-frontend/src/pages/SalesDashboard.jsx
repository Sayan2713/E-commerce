import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function SalesDashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.get('/analytics/sales', { params: { days } }).then((r) => setData(r.data));
  }, [days]);

  return (
    <div>
      <h2>Sales Dashboard</h2>
      <p style={{ color: '#777', fontSize: 13 }}>What's actually selling - separate from the Accounting page, which covers the financial/tax side.</p>

      <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ marginBottom: 16 }}>
        <option value={7}>Last 7 days</option>
        <option value={30}>Last 30 days</option>
        <option value={90}>Last 90 days</option>
      </select>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <Stat label="Orders" value={data.totalOrders} />
            <Stat label="Revenue" value={`Rs. ${data.totalRevenue.toFixed(2)}`} />
            <Stat label="Categories Sold" value={data.categoryBreakdown.length} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4>Best Sellers</h4>
              <table width="100%" cellPadding={6} style={{ background: 'white' }}>
                <thead><tr><th align="left">Product</th><th align="left">Qty Sold</th><th align="left">Revenue</th></tr></thead>
                <tbody>
                  {data.bestSellers.map((p) => (
                    <tr key={p.productId}><td>{p.name}</td><td>{p.quantitySold}</td><td>Rs. {p.revenue.toFixed(2)}</td></tr>
                  ))}
                  {data.bestSellers.length === 0 && <tr><td colSpan={3} style={{ color: '#777' }}>No sales in this period.</td></tr>}
                </tbody>
              </table>
            </div>

            <div>
              <h4>Low Performers</h4>
              <table width="100%" cellPadding={6} style={{ background: 'white' }}>
                <thead><tr><th align="left">Product</th><th align="left">Qty Sold</th><th align="left">Revenue</th></tr></thead>
                <tbody>
                  {data.lowPerformers.map((p) => (
                    <tr key={p.productId}><td>{p.name}</td><td>{p.quantitySold}</td><td>Rs. {p.revenue.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h4 style={{ marginTop: 24 }}>Category Breakdown</h4>
          <table width="100%" cellPadding={6} style={{ background: 'white' }}>
            <thead><tr><th align="left">Category</th><th align="left">Qty Sold</th><th align="left">Revenue</th></tr></thead>
            <tbody>
              {data.categoryBreakdown.map((c) => (
                <tr key={c.category}><td>{c.category}</td><td>{c.quantitySold}</td><td>Rs. {c.revenue.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: '#777' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
