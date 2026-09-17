import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import api from '../api/client';
import StarRating from '../components/StarRating';
import ReviewsSection from '../components/ReviewsSection';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import { recordView } from '../api/recentlyViewed';

export default function ProductScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => { setProduct(r.data.product); recordView(id); })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>This product could not be found.</Text>
      </View>
    );
  }
  if (!product) return null;

  const allOutOfStock = product.variants.every((v) => v.outOfStock);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/users/me/saved-items/${id}`);
      setSaved((s) => !s);
    } finally {
      setSaving(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError('Please select a size to continue'); return; }
    setSizeError('');
    navigation.navigate('Checkout', { productId: id, size: selectedSize, product });
  };

  return (
    <ScrollView style={styles.screen}>
      {product.images?.[0] ? (
        <Image source={{ uri: product.images[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: '#EAE2D6', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#777' }}>No image</Text>
        </View>
      )}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{product.name}</Text>
          <TouchableOpacity onPress={() => Share.share({ message: product.name })}>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>

        {product.ratingCount > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <StarRating value={product.ratingAvg} />
            <Text style={{ fontSize: 12, color: '#777' }}>{product.ratingAvg} ({product.ratingCount} reviews)</Text>
          </View>
        )}

        <Text style={styles.price}>Rs. {product.basePrice}</Text>
        <Text style={{ color: '#777' }}>Estimated delivery: 4-7 days</Text>

        {allOutOfStock ? (
          <Text style={{ color: '#c0392b', fontWeight: '700', marginTop: 12 }}>Out of stock</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {product.variants.map((v) => (
                <TouchableOpacity
                  key={v.size}
                  disabled={v.outOfStock}
                  onPress={() => { setSelectedSize(v.size); setSizeError(''); }}
                  style={[
                    styles.sizeChip,
                    selectedSize === v.size && { backgroundColor: '#8B9A6E' },
                    v.outOfStock && { opacity: 0.4 },
                  ]}
                >
                  <Text style={{ color: selectedSize === v.size ? 'white' : 'black' }}>{v.size}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {sizeError ? <Text style={{ color: '#c0392b', fontSize: 12, marginTop: 6 }}>{sizeError}</Text> : null}
          </>
        )}

        {product.highlights?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Product Highlights</Text>
            {product.highlights.map((h, i) => <Text key={i}>- {h}</Text>)}
          </>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text>{product.description}</Text>

        <ReviewsSection productId={id} ratingAvg={product.ratingAvg} ratingCount={product.ratingCount} />
        <RelatedProducts navigation={navigation} productId={id} categoryId={product.category} />
        <RecentlyViewed navigation={navigation} excludeId={id} />
      </View>

      <View style={styles.buyBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          <Text>{saved ? 'Saved ✓' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buyBtn, allOutOfStock && { opacity: 0.5 }]} onPress={handleBuyNow} disabled={allOutOfStock}>
          <Text style={{ color: 'white', fontWeight: '700' }}>{allOutOfStock ? 'Out of Stock' : 'Buy Now'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  image: { width: '100%', height: 380 },
  title: { fontSize: 18, fontWeight: '700', flex: 1 },
  price: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  sizeChip: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  buyBar: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderColor: '#EEEEEE' },
  saveBtn: { paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8, backgroundColor: '#EAE2D6' },
  buyBtn: { flex: 1, backgroundColor: '#8B9A6E', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
});
