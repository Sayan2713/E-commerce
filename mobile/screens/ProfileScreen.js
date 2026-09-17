import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [orders, setOrders] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const loadOrders = () => {
    if (user) api.get('/orders').then((r) => setOrders(r.data.orders)).catch(() => setOrders([]));
  };
  useEffect(loadOrders, [user]);

  const cancelOrder = (order) => {
    Alert.alert('Cancel order?', `Cancel order ${order.orderId}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, cancel it',
        style: 'destructive',
        onPress: async () => {
          setCancellingId(order._id);
          try {
            await api.patch(`/orders/${order._id}/cancel`);
            loadOrders();
          } catch (err) {
            Alert.alert('Could not cancel', err.response?.data?.message || 'Please try again.');
          } finally {
            setCancellingId(null);
          }
        },
      },
    ]);
  };

  const requestReturn = (order) => {
    // Note: unlike the web version, this doesn't collect a free-text reason -
    // React Native has no built-in cross-platform text-input prompt
    // (Alert.prompt is iOS-only). Keeping it a simple confirm here.
    Alert.alert('Return this item?', `Request a return for ${order.orderId}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, request return',
        onPress: async () => {
          setReturningId(order._id);
          try {
            await api.post(`/orders/${order._id}/request-return`, {});
            loadOrders();
          } catch (err) {
            Alert.alert('Could not submit return', err.response?.data?.message || 'Please try again.');
          } finally {
            setReturningId(null);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }} onPress={() => navigation.navigate('EditProfile')}>
        <Image source={{ uri: user?.profilePic }} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#EAE2D6' }} />
        <View>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>{user?.name}</Text>
          <Text style={{ color: '#777' }}>{user?.mobile || user?.email}</Text>
          <Text style={{ color: '#8B9A6E', fontSize: 12, marginTop: 2 }}>Edit profile</Text>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <LangButton label="English" active={lang === 'en'} onPress={() => setLang('en')} />
        <LangButton label="हिंदी" active={lang === 'hi'} onPress={() => setLang('hi')} />
      </View>

      <Text style={styles.sectionTitle}>{t('orderHistory')}</Text>
      {orders === null && <Text style={{ color: '#777' }}>Loading orders...</Text>}
      {orders?.length === 0 && <Text style={{ color: '#777' }}>No orders yet.</Text>}
      <FlatList
        data={orders || []}
        keyExtractor={(o) => o.orderId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.orderId} - {item.status}</Text>
            {['PLACED', 'PACKED'].includes(item.status) && (
              <TouchableOpacity onPress={() => cancelOrder(item)} disabled={cancellingId === item._id}>
                <Text style={{ color: '#c0392b', fontSize: 13, marginTop: 4 }}>
                  {cancellingId === item._id ? 'Cancelling...' : 'Cancel Order'}
                </Text>
              </TouchableOpacity>
            )}
            {item.status === 'DELIVERED' && !item.returnRequested && item.items?.every((it) => it.isReturnable !== false) && (
              <TouchableOpacity onPress={() => requestReturn(item)} disabled={returningId === item._id}>
                <Text style={{ color: '#c0392b', fontSize: 13, marginTop: 4 }}>
                  {returningId === item._id ? 'Submitting...' : 'Return this item'}
                </Text>
              </TouchableOpacity>
            )}
            {item.returnRequested && <Text style={{ fontSize: 12, color: '#777', marginTop: 4 }}>Return requested - we'll be in touch.</Text>}
          </View>
        )}
      />

      <TouchableOpacity onPress={() => navigation.navigate('SavedItems')}><Text style={styles.link}>{t('savedItems')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}><Text style={styles.link}>{t('changePassword')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Policies')}><Text style={styles.link}>{t('legalPolicies')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')}><Text style={[styles.link, { color: '#c0392b' }]}>{t('deleteAccount')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={logout}><Text style={[styles.link, { color: '#c0392b' }]}>{t('logout')}</Text></TouchableOpacity>
    </View>
  );
}

function LangButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: active ? '#8B9A6E' : '#EEEEEE',
        backgroundColor: active ? '#8B9A6E' : 'white',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: active ? 'white' : 'black' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 16 },
  sectionTitle: { fontWeight: '700', marginTop: 12, marginBottom: 6 },
  card: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 6 },
  link: { paddingVertical: 10 },
});
