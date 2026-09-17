import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', dob: '', password: '', confirmPassword: '' });
  const { setUser } = useAuth();

  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/auth/register', form);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user); // AuthGate switches to the main app automatically
    } catch (e) {
      Alert.alert('Registration failed', e.response?.data?.message || 'Please try again');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Full name" value={form.name} onChangeText={set('name')} />
      <TextInput style={styles.input} placeholder="Mobile number" value={form.mobile} onChangeText={set('mobile')} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" value={form.dob} onChangeText={set('dob')} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={set('password')} />
      <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={form.confirmPassword} onChangeText={set('confirmPassword')} />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Sign Up</Text>
      </TouchableOpacity>
      <GoogleSignInButton />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 16 }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F2EB' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: 'white' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  googleBtn: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, backgroundColor: 'white' },
});
