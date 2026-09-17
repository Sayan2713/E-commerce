import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api/client';
import StarRating from '../components/StarRating';
import RecentlyViewed from '../components/RecentlyViewed';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories.filter((c) => !c.parent))).catch(() => {});
    api.get('/products').then((r) => setProducts(r.data.products)).catch(() => setProducts([]));
  }, []);

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
        <Text style={{ color: '#777' }}>Search for kurta, saree, jeans...</Text>
      </TouchableOpacity>

      {categories.length > 0 && (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(c) => c._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryPill} onPress={() => navigation.navigate('Category', { slug: item.slug, name: item.name })}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 12, flexGrow: 0 }}
        />
      )}

      {products === null && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#8B9A6E" />
        </View>
      )}
      {products?.length === 0 && (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: '#777' }}>No products yet - check back soon.</Text>
        </View>
      )}
      <FlatList
        data={products || []}
        keyExtractor={(p) => p._id}
        numColumns={2}
        ListHeaderComponent={<RecentlyViewed navigation={navigation} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('Product', { id: item._id })}>
            <Image source={{ uri: item.images?.[0] }} style={styles.productImage} />
            <Text numberOfLines={1}>{item.name}</Text>
            <Text style={{ fontWeight: '700' }}>Rs. {item.basePrice}</Text>
            {item.ratingCount > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <StarRating value={item.ratingAvg} size={11} />
                <Text style={{ fontSize: 10, color: '#777' }}>({item.ratingCount})</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 12 },
  searchBar: { backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  categoryPill: { backgroundColor: '#EAE2D6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  productCard: { flex: 1, margin: 6, backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', padding: 8 },
  productImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 6 },
});
