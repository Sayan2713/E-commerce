import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/client';

export default function ForgotPasswordScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { identifier });
      Alert.alert(
        'Check your email',
        'If an account exists for that email, a reset link has been sent. Open it in a browser to set a new password, then come back and log in.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={{ marginBottom: 12, color: '#555' }}>
        We'll email a reset link to your registered email address (the link opens in your browser).
      </Text>
      <TextInput style={styles.input} placeholder="Mobile number or Email" value={identifier} onChangeText={setIdentifier} />
      <TouchableOpacity style={styles.primaryBtn} onPress={submit} disabled={loading}>
        <Text style={{ color: 'white' }}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
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
