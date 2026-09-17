import { useEffect, useState } from 'react';
import adminApi from '../api/client';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Accounting() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.get('/orders/accounting/summary', { params: { month, year } }).then((r) => setData(r.data));
  }, [month, year]);

  return (
    <div>
      <h2>Accounting</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Stat label="Orders" value={data.summary.orderCount} />
            <Stat label="Revenue (Subtotal)" value={`Rs. ${data.summary.subtotal.toFixed(2)}`} />
            <Stat label="Total Collected" value={`Rs. ${data.summary.totalCollected.toFixed(2)}`} />
            <Stat label="Delivery Charges" value={`Rs. ${data.summary.deliveryCharges.toFixed(2)}`} />
            <Stat label="CGST Collected" value={`Rs. ${data.summary.cgst.toFixed(2)}`} />
            <Stat label="SGST Collected" value={`Rs. ${data.summary.sgst.toFixed(2)}`} />
            <Stat label="IGST Collected" value={`Rs. ${data.summary.igst.toFixed(2)}`} />
            <Stat label="Coupon Discounts" value={`Rs. ${data.summary.couponDiscounts.toFixed(2)}`} />
          </div>

          <h3 style={{ marginTop: 24 }}>Day-by-day</h3>
          <table width="100%" cellPadding={6} style={{ background: 'white' }}>
            <thead><tr><th align="left">Date</th><th align="left">Orders</th><th align="left">Collected</th></tr></thead>
            <tbody>
              {Object.entries(data.byDate).sort().map(([date, d]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{d.orderCount}</td>
                  <td>Rs. {d.totalCollected.toFixed(2)}</td>
                </tr>
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
