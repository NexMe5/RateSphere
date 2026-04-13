import { useState } from 'react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={`star-rating star-rating--${size}`} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${(hovered || value) >= star ? 'star--filled' : ''}`}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly ? -1 : 0}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
