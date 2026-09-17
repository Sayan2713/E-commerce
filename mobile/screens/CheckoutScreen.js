import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import api from '../api/client';
import { lookupPincode } from '../api/pincode';

export default function CheckoutScreen({ route, navigation }) {
  const { productId, size, product } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', pincode: '', postOffice: '', city: '', state: '', line1: '', line2: '', landmark: '' });
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
  const [couponCode, setCouponCode] = useState('');
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    api.get('/users/me').then((r) => {
      const addrs = r.data.user.addresses || [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      if (def) setSelectedAddress(def); else setShowForm(true);
    });
    api.post('/orders/checkout-started', { productId, size }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedAddress) return;
    api.post('/orders/price-preview', {
      items: [{ productId, size, quantity: 1 }],
      shippingAddress: selectedAddress,
      couponCode: couponCode || undefined,
    }).then((r) => setPricing(r.data)).catch(() => {});
  }, [selectedAddress, couponCode]);

  const saveAddress = async () => {
    const { data } = await api.post('/users/me/addresses', form);
    setAddresses(data.addresses);
    setSelectedAddress(data.addresses[data.addresses.length - 1]);
    setShowForm(false);
  };

  const placeOrder = async () => {
    try {
      const { data } = await api.post('/orders', {
        items: [{ productId, size, quantity: 1 }],
        shippingAddress: selectedAddress,
        couponCode: couponCode || undefined,
      });
      navigation.replace('OrderSuccess', { orderId: data.order.orderId });
    } catch (e) {
      Alert.alert('Order failed', e.response?.data?.message || 'Please try again');
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.h2}>Review Your Order</Text>
      <View style={styles.card}>
        <Text>{product.name}</Text>
        <Text>Size: {size}</Text>
        <Text style={{ fontWeight: '700' }}>Rs. {product.basePrice}</Text>
      </View>

      <Text style={styles.h3}>Delivery Address</Text>
      {selectedAddress && !showForm && (
        <View style={styles.card}>
          <Text>{selectedAddress.fullName}, {selectedAddress.phone}</Text>
          <Text>{selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</Text>
          <TouchableOpacity onPress={() => setShowForm(true)}><Text style={{ color: '#8B9A6E' }}>Change</Text></TouchableOpacity>
        </View>
      )}
      {showForm && (
        <View style={styles.card}>
          <TextInput placeholder="Full name" style={styles.input} value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
          <TextInput placeholder="Phone number" style={styles.input} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v.replace(/\D/g, '') })} keyboardType="phone-pad" maxLength={10} />
          <TextInput placeholder="PIN code" style={styles.input} value={form.pincode} onChangeText={handlePincodeChange} keyboardType="number-pad" maxLength={6} />
          {lookingUp && <Text style={{ fontSize: 12, color: '#777', marginTop: -6, marginBottom: 6 }}>Looking up city/state...</Text>}
          <TextInput placeholder="City" style={styles.input} value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} />
          <TextInput placeholder="Post Office" style={styles.input} value={form.postOffice} onChangeText={(v) => setForm({ ...form, postOffice: v })} />
          <TextInput placeholder="State" style={styles.input} value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
          <TextInput placeholder="Address line 1 (house no., street, area)" style={styles.input} value={form.line1} onChangeText={(v) => setForm({ ...form, line1: v })} />
          <TextInput placeholder="Address line 2 (optional)" style={styles.input} value={form.line2} onChangeText={(v) => setForm({ ...form, line2: v })} />
          <TextInput placeholder="Landmark / Near famous place (optional)" style={styles.input} value={form.landmark} onChangeText={(v) => setForm({ ...form, landmark: v })} />
          <TouchableOpacity style={styles.primaryBtn} onPress={saveAddress}><Text style={{ color: 'white' }}>Save Address</Text></TouchableOpacity>
        </View>
      )}

      <Text style={styles.h3}>Coupon Code</Text>
      <TextInput style={styles.input} placeholder="Enter coupon code" value={couponCode} onChangeText={(v) => setCouponCode(v.toUpperCase())} />

      {pricing && (
        <View style={styles.card}>
          <Row label="Subtotal" value={pricing.subtotal} />
          {pricing.gst.type === 'CGST_SGST' ? (
            <>
              <Row label={`CGST (${(pricing.gst.rate / 2).toFixed(1)}%)`} value={pricing.gst.cgstAmount} />
              <Row label={`SGST (${(pricing.gst.rate / 2).toFixed(1)}%)`} value={pricing.gst.sgstAmount} />
            </>
          ) : (
            <Row label={`IGST (${pricing.gst.rate}%)`} value={pricing.gst.igstAmount} />
          )}
          <Row label="Delivery Charge" value={pricing.deliveryCharge} />
          {pricing.couponDiscount > 0 && <Row label="Coupon Discount" value={-pricing.couponDiscount} />}
          <Row label="Total Payable (COD)" value={pricing.totalPayable} bold />
          <Text style={{ color: '#8B9A6E', marginTop: 6 }}>✓ Cash on Delivery available</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.primaryBtn, { margin: 16 }]} disabled={!selectedAddress} onPress={placeOrder}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, bold }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
      <Text style={{ fontWeight: bold ? '700' : '400' }}>{label}</Text>
      <Text style={{ fontWeight: bold ? '700' : '400' }}>Rs. {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 16 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  h3: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 10, marginBottom: 8, backgroundColor: 'white' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 14, alignItems: 'center' },
});
