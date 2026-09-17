const KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

export function recordView(productId) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    const next = [productId, ...existing.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) - not worth failing over
  }
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
