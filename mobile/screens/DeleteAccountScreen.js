import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { user, logout } = useAuth();
  const hasPassword = user?.hasPassword;

  const confirmDelete = () => {
    Alert.alert(
      'Delete your account?',
      "This permanently removes your profile, saved addresses, and saved items. Past orders are kept for tax records but no longer linked to an active account. This can't be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]
    );
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.delete('/users/me', { data: { password: password || 'google-account' } });
      await logout();
    } catch (e) {
      Alert.alert('Could not delete account', e.response?.data?.message || 'Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={{ color: '#555', marginBottom: 16 }}>
        This permanently removes your profile, saved addresses, and saved items.
        Past orders are kept for tax/accounting records but no longer linked to
        an active account.
      </Text>
      {hasPassword && (
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      )}
      <TouchableOpacity style={styles.dangerBtn} onPress={confirmDelete} disabled={deleting || (hasPassword && !password)}>
        <Text style={{ color: 'white' }}>{deleting ? 'Deleting...' : 'Delete my account'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: 'white' },
  dangerBtn: { backgroundColor: '#c0392b', borderRadius: 8, padding: 14, alignItems: 'center' },
});
