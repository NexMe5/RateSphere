import { useState } from 'react';
import StarRating from '../common/StarRating';
import Button from '../common/Button';

const RatingSubmitModal = ({ store, onSubmit }) => {
  const [rating, setRating] = useState(store.user_rating || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
      await onSubmit(rating);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-modal">
      <p>Click a star to rate <strong>{store.name}</strong></p>
      <StarRating value={rating} onChange={setRating} size="lg" />
      <p className="rating-hint">{rating > 0 ? `${rating} out of 5` : 'Select a rating'}</p>
      <Button fullWidth loading={loading} disabled={!rating} onClick={handleSubmit}>
        {store.user_rating ? 'Update Rating' : 'Submit Rating'}
      </Button>
    </div>
  );
};

export default RatingSubmitModal;
