import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/client';

export default function CategoryScreen({ route, navigation }) {
  const { slug, name } = route.params;
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api.get('/categories').then((r) => {
      const cat = r.data.categories.find((c) => c.slug === slug);
      if (cat) api.get('/products', { params: { category: cat._id } }).then((res) => setProducts(res.data.products));
      else setProducts([]);
    });
  }, [slug]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F2EB', padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>{name}</Text>
      {products === null && <ActivityIndicator size="large" color="#8B9A6E" style={{ marginTop: 40 }} />}
      {products?.length === 0 && <Text style={{ color: '#777', textAlign: 'center', marginTop: 40 }}>No products in this category yet.</Text>}
      <FlatList
        data={products || []}
        keyExtractor={(p) => p._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flex: 1, margin: 6, backgroundColor: 'white', borderRadius: 10, padding: 8 }}
            onPress={() => navigation.navigate('Product', { id: item._id })}
          >
            <Image source={{ uri: item.images?.[0] }} style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 6 }} />
            <Text numberOfLines={1}>{item.name}</Text>
            <Text style={{ fontWeight: '700' }}>Rs. {item.basePrice}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
