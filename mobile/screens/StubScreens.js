import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import api from '../api/client';

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:5173';

export function SavedItemsScreen() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    api.get('/users/me/saved-items').then((r) => setItems(r.data.savedItems)).catch(() => setItems([]));
  }, []);

  if (items === null) return <ActivityIndicator size="large" color="#8B9A6E" style={{ marginTop: 40 }} />;
  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F2EB', padding: 24, alignItems: 'center' }}>
        <Text style={{ color: '#777', marginTop: 40 }}>No saved items yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: '#F7F2EB' }}
      contentContainerStyle={{ padding: 16 }}
      data={items}
      keyExtractor={(i) => i._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.images?.[0] }} style={{ width: 60, height: 60, borderRadius: 8 }} />
          <Text style={{ marginLeft: 10 }}>{item.name}</Text>
        </View>
      )}
    />
  );
}

export function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Password too short', 'New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      Alert.alert('Password updated', 'Please log in again on your other devices.');
      setOldPassword('');
      setNewPassword('');
    } catch (e) {
      Alert.alert('Could not update password', e.response?.data?.message || 'Please check your current password and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F2EB', padding: 16 }}>
      <TextInput placeholder="Old password" secureTextEntry value={oldPassword} onChangeText={setOldPassword} style={styles.input} />
      <TextInput placeholder="New password" secureTextEntry value={newPassword} onChangeText={setNewPassword} style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={saving}>
        <Text style={{ color: 'white' }}>{saving ? 'Updating...' : 'Update Password'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Full Terms/Privacy/Return content lives on the web app (see
// frontend/src/pages/legal/) so there's one source of truth to keep
// updated - the mobile app links out to those same pages rather than
// duplicating the text and risking it drifting out of sync.
export function PoliciesScreen() {
  const openPolicy = (path) => Linking.openURL(`${WEB_APP_URL}${path}`);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F2EB', padding: 16 }}>
      <TouchableOpacity style={styles.linkCard} onPress={() => openPolicy('/policies/terms')}>
        <Text style={styles.linkTitle}>Terms & Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkCard} onPress={() => openPolicy('/policies/return')}>
        <Text style={styles.linkTitle}>Return Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkCard} onPress={() => openPolicy('/policies/privacy')}>
        <Text style={styles.linkTitle}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: 'white' },
  btn: { backgroundColor: '#8B9A6E', padding: 14, borderRadius: 8, alignItems: 'center' },
  linkCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 8 },
  linkTitle: { fontWeight: '600' },
});
