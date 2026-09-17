import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from '../api/client';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

/**
 * Call this once after login. Registers for push notifications and sends
 * the Expo push token to the backend so it can be used to notify this
 * device on order status changes (Shipped, Out for delivery, Delivered).
 *
 * Backend side (not yet scaffolded): add `expoPushToken` to the User model,
 * POST /api/users/me/push-token to save it, and call Expo's push API
 * (https://exp.host/--/api/v2/push/send) whenever admin updates an order status.
 */
export async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  await api.post('/users/me/push-token', { expoPushToken: token }).catch(() => {
    // endpoint TODO on backend - safe to ignore for now
  });

  return token;
}
