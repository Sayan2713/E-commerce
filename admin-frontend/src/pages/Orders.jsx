import { useEffect, useState } from 'react';
import adminApi from '../api/client';

const STATUSES = ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => adminApi.get('/orders').then((r) => setOrders(r.data.orders));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await adminApi.patch(`/orders/${id}/status`, { status });
    load();
  };

  const bookShipment = async (id) => {
    setBookingId(id);
    setError('');
    try {
      await adminApi.post(`/orders/${id}/book-shipment`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book shipment');
    } finally {
      setBookingId(null);
    }
  };

  const retryAwb = async (id) => {
    setBookingId(id);
    setError('');
    try {
      await adminApi.post(`/orders/${id}/retry-awb`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not assign a courier yet');
    } finally {
      setBookingId(null);
    }
  };

  const refreshTracking = async (id) => {
    setTrackingId(id);
    try {
      await adminApi.get(`/orders/${id}/track`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not refresh tracking');
    } finally {
      setTrackingId(null);
    }
  };

  return (
    <div>
      <h2>Orders (COD)</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <table width="100%" cellPadding={6} style={{ background: 'white' }}>
        <thead>
          <tr>
            <th align="left">Order ID</th>
            <th align="left">Customer</th>
            <th align="left">Total</th>
            <th align="left">Status</th>
            <th align="left">Return</th>
            <th align="left">Shipment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.orderId}</td>
              <td>{o.user?.name} ({o.user?.mobile})</td>
              <td>Rs. {o.totalPayable}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {o.invoiceUrl && <a href={o.invoiceUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>Invoice</a>}
              </td>
              <td>
                {o.returnRequested ? (
                  <div style={{ fontSize: 12, color: '#c0392b' }}>
                    <div style={{ fontWeight: 600 }}>Return requested</div>
                    {o.returnReason && <div>"{o.returnReason}"</div>}
                    <div>{new Date(o.returnRequestedAt).toLocaleDateString()}</div>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: '#999' }}>-</span>
                )}
              </td>
              <td>
                {o.shipment?.awbCode ? (
                  <div style={{ fontSize: 12 }}>
                    <div>AWB: {o.shipment.awbCode}</div>
                    <div>{o.shipment.courierName} - {o.shipment.lastTrackedStatus}</div>
                    <button onClick={() => refreshTracking(o._id)} disabled={trackingId === o._id}>
                      {trackingId === o._id ? 'Refreshing...' : 'Refresh tracking'}
                    </button>
                  </div>
                ) : o.shipment?.shipmentId ? (
                  <div style={{ fontSize: 12 }}>
                    <div style={{ color: '#c0392b' }}>Shipment created, no courier assigned yet</div>
                    <button onClick={() => retryAwb(o._id)} disabled={bookingId === o._id}>
                      {bookingId === o._id ? 'Retrying...' : 'Retry courier assignment'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => bookShipment(o._id)} disabled={bookingId === o._id}>
                    {bookingId === o._id ? 'Booking...' : 'Book Shipment (Shiprocket)'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
