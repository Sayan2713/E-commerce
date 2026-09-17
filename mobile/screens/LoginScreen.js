import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(identifier, password);
      // No manual navigation needed - AuthGate (App.js) watches `user` and
      // switches to the main tab navigator automatically once it's set.
    } catch {
      Alert.alert('Login failed', 'Invalid mobile/email or password');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Mobile number or Email" value={identifier} onChangeText={setIdentifier} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={{ marginTop: 10 }}>Forgot password?</Text>
      </TouchableOpacity>
      {/* Google login on mobile: uses expo-auth-session (GoogleSignInButton)
          to get an idToken, then POSTs it to /api/auth/google - same endpoint as web. */}
      <GoogleSignInButton />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ marginTop: 20 }}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F2EB' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: 'white' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  googleBtn: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, backgroundColor: 'white' },
});
