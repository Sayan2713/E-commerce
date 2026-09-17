import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import StarPicker from './StarPicker';

export default function ReviewsSection({ productId, ratingAvg, ratingCount }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null); // null = loading
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${productId}/reviews`)
      .then((r) => setReviews(r.data.reviews))
      .catch(() => setReviews([]));
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a star rating');
      return;
    }
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
    <div style={{ marginTop: 40, fontFamily: 'sans-serif' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EAE2D6',
          paddingBottom: 12,
          marginBottom: 20,
        }}
      >
        <h4
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#2D2D2D',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          Customer Reviews
        </h4>

        {ratingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating value={ratingAvg} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D' }}>
              {ratingAvg}
            </span>
            <span style={{ fontSize: 13, color: '#666666' }}>({ratingCount})</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {reviews === null && (
        <div style={{ color: '#666666', fontSize: 14, padding: '12px 0' }}>
          Loading reviews...
        </div>
      )}

      {/* Empty State */}
      {reviews?.length === 0 && (
        <div
          style={{
            backgroundColor: '#F7F2EB',
            border: '1px solid #EAE2D6',
            borderRadius: 12,
            padding: 20,
            color: '#666666',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          No reviews yet. Be the first to review this product after your order is delivered!
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews?.map((r) => (
          <div
            key={r._id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE2D6',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: '#EAE2D6',
                    color: '#8B9A6E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {(r.user?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <strong style={{ fontSize: 14, color: '#2D2D2D' }}>
                  {r.user?.name || 'Verified Buyer'}
                </strong>
              </div>
              <StarRating value={r.rating} size={13} />
            </div>

            {r.comment && (
              <p
                style={{
                  margin: '8px 0 0 38px',
                  fontSize: 13,
                  color: '#666666',
                  lineHeight: 1.5,
                }}
              >
                {r.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Review Submission Form */}
      {user && !submitted && (
        <form
          onSubmit={submitReview}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAE2D6',
            borderRadius: 16,
            padding: 20,
            marginTop: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: '#2D2D2D',
              marginBottom: 12,
            }}
          >
            Write a Review
          </div>

          <div style={{ marginBottom: 12 }}>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <textarea
            placeholder="Share your experience with this product (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              minHeight: 80,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #EAE2D6',
              backgroundColor: '#F7F2EB',
              fontSize: 13,
              color: '#2D2D2D',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />

          {error && (
            <div
              style={{
                color: '#D9534F',
                fontSize: 13,
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              backgroundColor: submitting ? '#A3B18A' : btnHover ? '#7A895E' : '#8B9A6E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: 14,
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: 12,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'background 0.2s ease',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>

          <div
            style={{
              fontSize: 12,
              color: '#666666',
              marginTop: 10,
              fontStyle: 'italic',
            }}
          >
            Note: You can review a product once it has been delivered to your address.
          </div>
        </form>
      )}

      {/* Success Banner */}
      {submitted && (
        <div
          style={{
            backgroundColor: '#F7F2EB',
            border: '1px solid #8B9A6E',
            color: '#8B9A6E',
            padding: 14,
            borderRadius: 12,
            marginTop: 16,
            fontWeight: 700,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          ✓ Thanks for your feedback! Your review has been submitted.
        </div>
      )}
    </div>
  );
}