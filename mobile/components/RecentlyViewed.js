import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/client';
import { getRecentlyViewed } from '../api/recentlyViewed';
import StarRating from './StarRating';

export default function RecentlyViewed({ navigation, excludeId, title = 'Recently Viewed' }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = (await getRecentlyViewed()).filter((id) => id !== excludeId);
      if (ids.length === 0) { setProducts([]); return; }
      try {
        const { data } = await api.get('/products', { params: { ids: ids.join(',') } });
        const byId = Object.fromEntries(data.products.map((p) => [p._id, p]));
        const ordered = ids.map((id) => byId[id]).filter(Boolean);
        if (!cancelled) setProducts(ordered);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={(p) => p._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.push('Product', { id: item._id })}>
            <Image source={{ uri: item.images?.[0] }} style={styles.image} />
            <Text numberOfLines={1} style={{ fontSize: 12 }}>{item.name}</Text>
            <Text style={{ fontWeight: '700', fontSize: 13 }}>Rs. {item.basePrice}</Text>
            {item.ratingCount > 0 && <StarRating value={item.ratingAvg} size={11} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  card: { width: 130, marginRight: 12, backgroundColor: 'white', borderRadius: 10, padding: 8 },
  image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 6 },
});
