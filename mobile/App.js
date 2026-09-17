import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import CompleteProfileScreen from './screens/CompleteProfileScreen';

const AuthStack = createNativeStackNavigator();

// Forces Login/Register before Home loads, per requirement - unlike the web
// flow (which allows guest browsing), the app shows nothing else until the
// user is authenticated. First-time Google sign-ins with a missing
// mobile/DOB get routed to CompleteProfileScreen before the main app too.
function AuthGate() {
  const { user, booting } = useAuth();

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F2EB' }}>
        <ActivityIndicator size="large" color="#8B9A6E" />
      </View>
    );
  }

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#8B9A6E' }, headerTintColor: 'white' }}>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: false }} />
        <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      </AuthStack.Navigator>
    );
  }

  if (user.profileComplete === false) {
    return <CompleteProfileScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AuthGate />
        </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
}

// Push notification registration: call registerForPushNotifications() from
// api/pushNotifications.js right after a successful login (see LoginScreen /
// AuthContext) so the Expo push token gets saved against the user for
// order-status alerts (Shipped, Out for delivery, Delivered).
