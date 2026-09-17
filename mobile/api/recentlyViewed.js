import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

export async function recordView(productId) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const next = [productId, ...existing.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // non-critical - don't block product page rendering over this
  }
}

export async function getRecentlyViewed() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
