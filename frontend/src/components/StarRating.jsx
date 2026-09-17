export default function StarRating({ value = 0, size = 16, showScore = false }) {
  const roundedValue = Math.round(value * 2) / 2; // rounds to nearest 0.5

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontFamily: 'sans-serif',
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        let fillPercentage = 0;
        if (roundedValue >= star) {
          fillPercentage = 100;
        } else if (roundedValue === star - 0.5) {
          fillPercentage = 50;
        }

        return (
          <span
            key={star}
            style={{
              position: 'relative',
              fontSize: size,
              lineHeight: 1,
              color: '#EAE2D6', // Empty star color
              display: 'inline-block',
            }}
          >
            ★
            {fillPercentage > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${fillPercentage}%`,
                  overflow: 'hidden',
                  color: '#8B9A6E', // Active olive star color
                  whiteSpace: 'nowrap',
                }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}

      {showScore && (
        <span
          style={{
            fontSize: size * 0.8,
            color: '#2D2D2D',
            fontWeight: 700,
            marginLeft: 4,
          }}
        >
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}