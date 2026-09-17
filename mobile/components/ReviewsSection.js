import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/client';
import StarRating from './StarRating';
import StarPicker from './StarPicker';

export default function ReviewsSection({ productId, ratingAvg, ratingCount }) {
  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/products/${productId}/reviews`)
      .then((r) => setReviews(r.data.reviews))
      .catch(() => setReviews([]));
  }, [productId]);

  const submitReview = async () => {
    if (!rating) { setError('Please select a star rating'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reviews', { productId, rating, comment });
      setSubmitted(true);
      const { data } = await api.get(`/products/${productId}/reviews`);
      setReviews(data.reviews);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        {ratingCount > 0 && (
          <>
            <StarRating value={ratingAvg} />
            <Text style={{ fontSize: 12, color: '#777' }}>{ratingAvg} ({ratingCount})</Text>
          </>
        )}
      </View>

      {reviews === null && <Text style={{ color: '#777' }}>Loading reviews...</Text>}
      {reviews?.length === 0 && <Text style={{ color: '#777' }}>No reviews yet. Be the first to review this after it's delivered.</Text>}
      {reviews?.map((r) => (
        <View key={r._id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700' }}>{r.user?.name || 'Customer'}</Text>
            <StarRating value={r.rating} size={12} />
          </View>
          {r.comment ? <Text style={{ marginTop: 4 }}>{r.comment}</Text> : null}
        </View>
      ))}

      {!submitted && (
        <View style={styles.card}>
          <Text style={{ marginBottom: 8 }}>Write a review</Text>
          <StarPicker value={rating} onChange={setRating} />
          <TextInput
            placeholder="Share your experience (optional)"
            value={comment}
            onChangeText={setComment}
            multiline
            style={[styles.input, { height: 70, marginTop: 10 }]}
          />
          {error ? <Text style={{ color: '#c0392b', fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
          <TouchableOpacity style={styles.primaryBtn} onPress={submitReview} disabled={submitting}>
            <Text style={{ color: 'white' }}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: '#777', marginTop: 6 }}>You can review a product once it's been delivered to you.</Text>
        </View>
      )}
      {submitted && <Text style={{ color: '#8B9A6E', marginTop: 8 }}>Thanks for your review!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 8, padding: 10, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: '#8B9A6E', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 10 },
});
