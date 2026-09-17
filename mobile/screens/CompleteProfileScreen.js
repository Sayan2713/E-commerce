import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfileScreen() {
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [saving, setSaving] = useState(false);
  const { setUser } = useAuth();

  const submit = async () => {
    if (!mobile || !dob) {
      Alert.alert('Almost there', 'Please fill in both fields to continue.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post('/auth/complete-profile', { mobile, dob });
      setUser(data.user); // AuthGate re-checks profileComplete and moves to the main app
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Just one more step</Text>
      <Text style={{ marginBottom: 16, color: '#555' }}>
        Please add your mobile number and date of birth to finish setting up your account.
      </Text>
      <TextInput style={styles.input} placeholder="Mobile number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
      <TouchableOpacity style={styles.primaryBtn} onPress={submit} disabled={saving}>
        <Text style={{ color: 'white', fontWeight: '700' }}>{saving ? 'Saving...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F2EB' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: 'white' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 14, alignItems: 'center' },
});
