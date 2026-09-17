import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import api from '../api/client';

export function ContactScreen() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get('/settings/contact').then((r) => setContact(r.data)).catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Missing info', 'Please fill in your name, email, and message.');
      return;
    }
    setSending(true);
    try {
      await api.post('/support', form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      Alert.alert('Could not send', err.response?.data?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  const hasAnyContact = contact?.whatsappNumber || contact?.supportPhone || contact?.supportEmail;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Contact Us / Help Center</Text>
      <Text style={{ color: '#555', marginBottom: 16 }}>
        Have a question about an order, a product, or anything else? Send us
        a message and we'll get back to you.
      </Text>

      {hasAnyContact && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {contact.whatsappNumber && (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Linking.openURL(`https://wa.me/${contact.whatsappNumber}`)}>
              <Text style={{ color: 'white' }}>WhatsApp</Text>
            </TouchableOpacity>
          )}
          {contact.supportPhone && (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(`tel:${contact.supportPhone}`)}>
              <Text>Call {contact.supportPhone}</Text>
            </TouchableOpacity>
          )}
          {contact.supportEmail && (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(`mailto:${contact.supportEmail}`)}>
              <Text>{contact.supportEmail}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {sent ? (
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={{ fontWeight: '700' }}>Message sent!</Text>
          <Text style={{ color: '#777', marginTop: 4 }}>We'll get back to you soon.</Text>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <TextInput style={styles.input} placeholder="Your name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
          <TextInput style={styles.input} placeholder="Phone (optional)" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
          <TextInput style={styles.input} placeholder="Subject (optional)" value={form.subject} onChangeText={(v) => setForm({ ...form, subject: v })} />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="How can we help?"
            multiline
            value={form.message}
            onChangeText={(v) => setForm({ ...form, message: v })}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={submit} disabled={sending}>
            <Text style={{ color: 'white' }}>{sending ? 'Sending...' : 'Send Message'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

export function AboutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F7F2EB', padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>About Us</Text>
      <Text style={{ marginTop: 8 }}>Content to be provided by the client.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, backgroundColor: 'white' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 12 },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 12, alignItems: 'center' },
});
