import { useState } from 'react';

export default function StarPicker({ value = 0, onChange, size = 26 }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || value);

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} out of 5 stars`}
            style={{
              background: 'none',
              border: 'none',
              padding: 2,
              cursor: 'pointer',
              fontSize: size,
              lineHeight: 1,
              color: isFilled ? '#8B9A6E' : '#EAE2D6',
              transform: hover === star ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.15s ease, color 0.15s ease',
              outline: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ★
          </button>
        );
      })}
      
      {(hover || value) > 0 && (
        <span
          style={{
            marginLeft: 8,
            fontSize: 13,
            fontWeight: 700,
            color: '#2D2D2D',
            fontFamily: 'sans-serif',
          }}
        >
          {hover || value} / 5
        </span>
      )}
    </div>
  );
}