import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import api from '../api/client';
import StarRating from '../components/StarRating';
import { useLanguage } from '../context/LanguageContext';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SearchScreen({ navigation }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ sizes: [], colors: [], priceRange: { min: 0, max: 5000 } });
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/products/filters').then((r) => setFilterOptions(r.data)).catch(() => {});
  }, []);

  const runSearch = () => {
    setProducts(null);
    const params = {};
    if (query) params.search = query;
    if (size) params.size = size;
    if (color) params.color = color;
    if (sort) params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    api.get('/products', { params }).then((r) => setProducts(r.data.products)).catch(() => setProducts([]));
  };

  useEffect(() => { runSearch(); }, [size, color, sort, minPrice, maxPrice]);

  const clearFilters = () => {
    setSize(''); setColor(''); setSort(''); setMinPrice(''); setMaxPrice('');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={runSearch} style={styles.searchBtn}><Text style={{ color: 'white' }}>{t('search')}</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setShowFilters((s) => !s)} style={styles.filterToggle}>
        <Text style={{ color: '#8B9A6E' }}>{showFilters ? 'Hide filters' : `${t('filters')} ▾`}</Text>
      </TouchableOpacity>

      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <View style={{ flexDirection: 'row', gap: 6, marginRight: 12 }}>
            <TextInput style={styles.priceInput} placeholder="Min" keyboardType="number-pad" value={minPrice} onChangeText={setMinPrice} />
            <TextInput style={styles.priceInput} placeholder="Max" keyboardType="number-pad" value={maxPrice} onChangeText={setMaxPrice} />
          </View>
          {filterOptions.sizes.map((s) => (
            <Chip key={s} label={s} active={size === s} onPress={() => setSize(size === s ? '' : s)} />
          ))}
          {filterOptions.colors.map((c) => (
            <Chip key={c} label={c} active={color === c} onPress={() => setColor(color === c ? '' : c)} />
          ))}
          <TouchableOpacity onPress={clearFilters} style={{ justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ color: '#c0392b', fontSize: 12 }}>{t('clearFilters')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {SORT_OPTIONS.map((o) => (
            <Chip key={o.value} label={o.label} active={sort === o.value} onPress={() => setSort(o.value)} />
          ))}
        </ScrollView>
      )}

      {products === null && <ActivityIndicator size="large" color="#8B9A6E" style={{ marginTop: 30 }} />}
      {products?.length === 0 && <Text style={{ color: '#777', textAlign: 'center', marginTop: 30 }}>{t('noProductsMatch')}</Text>}

      <FlatList
        data={products || []}
        keyExtractor={(p) => p._id}
        numColumns={2}
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

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: '#8B9A6E', borderColor: '#8B9A6E' }]}
    >
      <Text style={{ color: active ? 'white' : 'black', fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F2EB', padding: 12 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  searchBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  filterToggle: { marginBottom: 8 },
  filterBar: { marginBottom: 8, maxHeight: 40 },
  priceInput: { width: 60, backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 12 },
  chip: { borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: 'white', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, justifyContent: 'center' },
  productCard: { flex: 1, margin: 6, backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', padding: 8 },
  productImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 6 },
});
