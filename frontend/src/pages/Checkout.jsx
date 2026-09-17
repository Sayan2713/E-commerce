import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { validateAddressForm } from '../utils/validators';
import { lookupPincode } from '../utils/pincode';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { productId, size, product } = state || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api.get('/users/me').then((r) => {
      const addrs = r.data.user.addresses || [];
      setAddresses(addrs);
      setSelectedAddress(addrs.find((a) => a.isDefault) || addrs[0] || null);
      if (addrs.length === 0) setShowAddressForm(true);
    });

    if (productId && size) api.post('/orders/checkout-started', { productId, size }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedAddress) return;
    setPricingLoading(true);
    setCouponMessage('');
    api.post('/orders/price-preview', {
      items: [{ productId, size, quantity: 1 }],
      shippingAddress: selectedAddress,
      couponCode: appliedCoupon || undefined,
    })
      .then((r) => {
        setPricing(r.data);
        setError('');
        if (appliedCoupon && r.data.couponDiscount === 0) setCouponMessage("This coupon doesn't apply to your order");
        else if (appliedCoupon && r.data.couponDiscount > 0) setCouponMessage(`Coupon applied — you saved ₹${r.data.couponDiscount.toLocaleString('en-IN')}`);
      })
      .catch((e) => setError(e.response?.data?.message || 'Could not calculate pricing'))
      .finally(() => setPricingLoading(false));
  }, [selectedAddress, appliedCoupon]);

  const applyCoupon = () => {
    setAppliedCoupon(couponInput.trim().toUpperCase());
  };

  const removeCoupon = () => {
    setCouponInput('');
    setAppliedCoupon('');
    setCouponMessage('');
  };

  const saveAddress = async (form) => {
    const { data } = await api.post('/users/me/addresses', form);
    setAddresses(data.addresses);
    setSelectedAddress(data.addresses[data.addresses.length - 1]);
    setShowAddressForm(false);
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: [{ productId, size, quantity: 1 }],
        shippingAddress: selectedAddress,
        couponCode: appliedCoupon || undefined,
      });
      navigate('/order-success', { state: { orderId: data.order.orderId } });
    } catch (e) {
      setError(e.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!product) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', padding: 32, borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <h3 style={{ color: '#2D2D2D', margin: '0 0 8px 0', fontSize: 18 }}>Order Details Missing</h3>
          <p style={{ color: '#666666', fontSize: 14, marginBottom: 20 }}>Please go back and select a product to proceed to checkout.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#8B9A6E',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Explore Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '30px auto', padding: '0 16px 60px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span
          style={{
            background: '#EAE2D6',
            color: '#8B9A6E',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: 8,
          }}
        >
          Secure Checkout
        </span>
        <h1 style={{ fontSize: 26, color: '#2D2D2D', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Review Your Order
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Section 1: Product Summary Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #EAE2D6',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{
              width: 84,
              height: 84,
              objectFit: 'cover',
              borderRadius: 12,
              border: '1px solid #EAE2D6',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#2D2D2D', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
              <span
                style={{
                  background: '#F7F2EB',
                  border: '1px solid #EAE2D6',
                  color: '#666666',
                  fontSize: 12,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Size: {size}
              </span>
              <span style={{ fontSize: 12, color: '#8B9A6E', fontWeight: 600 }}>In Stock</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#2D2D2D', marginTop: 4 }}>
              ₹{product.basePrice?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Address Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #EAE2D6',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#2D2D2D', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📍</span> Delivery Address
            </h3>
            {selectedAddress && !showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                style={{
                  background: '#F7F2EB',
                  border: '1px solid #EAE2D6',
                  color: '#8B9A6E',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Change
              </button>
            )}
          </div>

          {selectedAddress && !showAddressForm && (
            <div
              style={{
                background: '#F7F2EB',
                border: '1px solid #EAE2D6',
                padding: 14,
                borderRadius: 12,
                fontSize: 13,
                color: '#2D2D2D',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, color: '#2D2D2D', fontSize: 14, marginBottom: 2 }}>
                {selectedAddress.fullName} <span style={{ color: '#666666', fontWeight: 500 }}>• {selectedAddress.phone}</span>
              </div>
              <div style={{ color: '#555555' }}>
                {selectedAddress.line1}{selectedAddress.landmark ? `, Near ${selectedAddress.landmark}` : ''}, {selectedAddress.city}, {selectedAddress.state} - <strong>{selectedAddress.pincode}</strong>
              </div>
              {selectedAddress.postOffice && (
                <div style={{ fontSize: 11, color: '#888888', marginTop: 4 }}>
                  Post Office: {selectedAddress.postOffice}
                </div>
              )}
            </div>
          )}

          {showAddressForm && (
            <AddressForm
              onSave={saveAddress}
              onCancel={() => setShowAddressForm(false)}
              canCancel={addresses.length > 0}
            />
          )}
        </div>

        {/* Section 3: Coupon Code */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #EAE2D6',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700, color: '#2D2D2D', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🏷️</span> Have a Coupon?
          </h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              placeholder="ENTER COUPON CODE"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #EAE2D6',
                backgroundColor: '#F7F2EB',
                color: '#2D2D2D',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.5px',
                outline: 'none',
              }}
            />
            {appliedCoupon ? (
              <button
                onClick={removeCoupon}
                style={{
                  background: '#FDF2F2',
                  border: '1px solid #F8B4B4',
                  color: '#9B1C1C',
                  padding: '0 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                disabled={!couponInput.trim() || pricingLoading}
                style={{
                  background: !couponInput.trim() || pricingLoading ? '#C4CBB7' : '#8B9A6E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !couponInput.trim() || pricingLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Apply
              </button>
            )}
          </div>

          {couponMessage && (
            <div
              style={{
                fontSize: 12,
                marginTop: 10,
                fontWeight: 600,
                padding: '8px 12px',
                borderRadius: 8,
                background: couponMessage.includes('saved') ? '#F4F7F0' : '#FFF8F8',
                color: couponMessage.includes('saved') ? '#8B9A6E' : '#C53030',
                border: `1px solid ${couponMessage.includes('saved') ? '#EAE2D6' : '#FEB2B2'}`,
              }}
            >
              {couponMessage}
            </div>
          )}
        </div>

        {/* Section 4: Price Preview */}
        {pricingLoading && (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              color: '#8B9A6E',
              fontSize: 13,
              fontWeight: 600,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE2D6',
            }}
          >
            ✨ Calculating your best price...
          </div>
        )}

        {pricing && !pricingLoading && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #EAE2D6',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>
              Price Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <Row label="Item Subtotal" value={`₹${pricing.subtotal.toLocaleString('en-IN')}`} />
              
              {pricing.gst.type === 'CGST_SGST' ? (
                <>
                  <Row label={`CGST (${(pricing.gst.rate / 2).toFixed(1)}%)`} value={`₹${pricing.gst.cgstAmount.toLocaleString('en-IN')}`} />
                  <Row label={`SGST (${(pricing.gst.rate / 2).toFixed(1)}%)`} value={`₹${pricing.gst.sgstAmount.toLocaleString('en-IN')}`} />
                </>
              ) : (
                <Row label={`IGST (${pricing.gst.rate}%)`} value={`₹${pricing.gst.igstAmount.toLocaleString('en-IN')}`} />
              )}

              <Row label="Delivery Charge" value={pricing.deliveryCharge === 0 ? 'FREE' : `₹${pricing.deliveryCharge}`} highlighted={pricing.deliveryCharge === 0} />
              
              {pricing.couponDiscount > 0 && (
                <Row label="Coupon Discount" value={`- ₹${pricing.couponDiscount.toLocaleString('en-IN')}`} green />
              )}

              <div style={{ borderTop: '1px dashed #EAE2D6', marginTop: 8, paddingTop: 12 }}>
                <Row label="Total Payable (COD)" value={`₹${pricing.totalPayable.toLocaleString('en-IN')}`} bold />
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                background: '#F7F2EB',
                border: '1px solid #EAE2D6',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: '#8B9A6E',
                fontWeight: 700,
              }}
            >
              <span>🚚</span> Cash on Delivery available for this location.
            </div>
          </div>
        )}

        {/* Section 5: Error Handling */}
        {error && (
          <div
            style={{
              background: '#FDF2F2',
              border: '1px solid #F8B4B4',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ color: '#9B1C1C', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Order could not be placed
            </div>
            <div style={{ color: '#771D1D', fontSize: 13, marginBottom: 12 }}>{error}</div>
            <button
              onClick={placeOrder}
              disabled={placing}
              style={{
                background: '#9B1C1C',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {placing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        )}

        {/* Place Order CTA Button */}
        <button
          onClick={placeOrder}
          disabled={!selectedAddress || placing || pricingLoading}
          style={{
            width: '100%',
            backgroundColor: !selectedAddress || placing || pricingLoading ? '#C4CBB7' : '#8B9A6E',
            color: '#FFFFFF',
            padding: '16px 24px',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.5px',
            cursor: !selectedAddress || placing || pricingLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(139, 154, 110, 0.3)',
            transition: 'transform 0.1s ease, background 0.2s ease',
          }}
        >
          {placing ? 'Placing Your Order...' : 'Place Order via Cash on Delivery'}
        </button>

      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlighted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: bold ? 800 : 400, fontSize: bold ? 16 : 14 }}>
      <span style={{ color: bold ? '#2D2D2D' : '#666666' }}>{label}</span>
      <span
        style={{
          color: green ? '#8B9A6E' : bold ? '#2D2D2D' : '#2D2D2D',
          fontWeight: bold || green || highlighted ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function AddressForm({ onSave, onCancel, canCancel }) {
  const [form, setForm] = useState({ fullName: '', phone: '', pincode: '', postOffice: '', city: '', state: '', line1: '', line2: '', landmark: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);

  const handlePincodeChange = async (value) => {
    setForm((f) => ({ ...f, pincode: value }));
    if (/^\d{6}$/.test(value)) {
      setLookingUp(true);
      const result = await lookupPincode(value);
      setLookingUp(false);
      if (result) setForm((f) => ({ ...f, pincode: value, city: result.city, state: result.state, postOffice: result.postOffice || f.postOffice }));
    }
  };

  const handleSave = async () => {
    const validationError = validateAddressForm(form);
    if (validationError) { setError(validationError); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 8,
    border: '1px solid #EAE2D6',
    backgroundColor: '#F7F2EB',
    color: '#2D2D2D',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        border: '1px solid #EAE2D6',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 8,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            Full Name *
          </label>
          <input
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            Phone Number *
          </label>
          <input
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
            maxLength={10}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            PIN Code *
          </label>
          <input
            placeholder="6-digit PIN"
            value={form.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            maxLength={6}
            style={inputStyle}
          />
          {lookingUp && <div style={{ fontSize: 11, color: '#8B9A6E', marginTop: 3 }}>🔍 Looking up area...</div>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            City *
          </label>
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            State *
          </label>
          <input
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
          Address Line 1 *
        </label>
        <input
          placeholder="House No., Flat, Building, Street"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            Landmark (Optional)
          </label>
          <input
            placeholder="Near park, school, etc."
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8B9A6E', marginBottom: 4, textTransform: 'uppercase' }}>
            Post Office (Optional)
          </label>
          <input
            placeholder="Post Office Branch"
            value={form.postOffice}
            onChange={(e) => setForm({ ...form, postOffice: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#9B1C1C', background: '#FDF2F2', padding: 10, borderRadius: 8, fontSize: 12, border: '1px solid #F8B4B4' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            background: '#8B9A6E',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save & Select Address'}
        </button>
        {canCancel && (
          <button
            onClick={onCancel}
            style={{
              background: '#F7F2EB',
              color: '#666666',
              border: '1px solid #EAE2D6',
              padding: '12px 18px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}