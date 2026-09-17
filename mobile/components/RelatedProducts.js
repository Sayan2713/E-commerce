import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/client';
import StarRating from './StarRating';

export default function RelatedProducts({ navigation, productId, categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    api.get('/products', { params: { category: categoryId, exclude: productId } })
      .then((r) => setProducts(r.data.products.slice(0, 8)))
      .catch(() => setProducts([]));
  }, [productId, categoryId]);

  if (products.length === 0) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.sectionTitle}>Related Products</Text>
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
