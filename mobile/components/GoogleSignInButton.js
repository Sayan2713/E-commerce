import { useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import api from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

/**
 * Requires three OAuth client IDs from the Google Cloud Console (same
 * project as the web client used in /api/auth/google):
 *  - a "Web application" client (used here for id_token issuance)
 *  - an "iOS" client (bundle id must match app.json's ios.bundleIdentifier)
 *  - an "Android" client (package must match app.json's android.package)
 * Put them in mobile/.env as EXPO_PUBLIC_GOOGLE_* below.
 */
export default function GoogleSignInButton() {
  const { setUser } = useAuth();

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'clothstore' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      responseType: ResponseType.IdToken,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    if (!idToken) return;

    (async () => {
      try {
        const { data } = await api.post('/auth/google', { idToken });
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        // If data.needsProfileCompletion is true, the app should route the
        // user to a "complete your profile" screen to collect mobile + DOB
        // before letting them buy anything (same rule as web).
      } catch (err) {
        Alert.alert('Google sign-in failed', 'Please try again.');
      }
    })();
  }, [response]);

  return (
    <TouchableOpacity style={styles.btn} disabled={!request} onPress={() => promptAsync()}>
      <Text>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, backgroundColor: 'white' },
});
