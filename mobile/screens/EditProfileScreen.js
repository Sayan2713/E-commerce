import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickAndUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      const fd = new FormData();
      fd.append('image', {
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      const { data } = await api.post('/upload/profile-pic', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfilePic(data.url);
    } catch {
      Alert.alert('Upload failed', 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', { mobile, profilePic });
      setUser(data.user);
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={pickAndUploadImage} style={{ alignSelf: 'center' }}>
        <Image
          source={{ uri: profilePic || undefined }}
          style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#EAE2D6' }}
        />
        <Text style={{ textAlign: 'center', marginTop: 6, color: '#8B9A6E' }}>{uploading ? 'Uploading...' : 'Change photo'}</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Mobile number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

      <TouchableOpacity style={styles.primaryBtn} onPress={save} disabled={saving || uploading}>
        <Text style={{ color: 'white', fontWeight: '700' }}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 24, gap: 16 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 12, backgroundColor: 'white' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 14, alignItems: 'center' },
});
