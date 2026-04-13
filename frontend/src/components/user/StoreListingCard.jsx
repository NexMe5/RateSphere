import { useState } from 'react';
import StarRating from '../common/StarRating';
import Modal from '../common/Modal';
import RatingSubmitModal from './RatingSubmitModal';

const StoreListingCard = ({ store, onRatingSubmit }) => {
  const [ratingOpen, setRatingOpen] = useState(false);

  return (
    <div className="store-card">
      <div className="store-card-header">
        <h3 className="store-name">{store.name}</h3>
        <StarRating value={Math.round(store.average_rating)} readOnly />
      </div>
      <p className="store-address">📍 {store.address}</p>
      <div className="store-card-footer">
        <div className="store-rating-info">
          <span>Overall: {Number(store.average_rating).toFixed(1)} / 5</span>
          {store.user_rating && <span>Your rating: {store.user_rating} ★</span>}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setRatingOpen(true)}>
          {store.user_rating ? 'Update Rating' : 'Rate Store'}
        </button>
      </div>

      <Modal isOpen={ratingOpen} onClose={() => setRatingOpen(false)}
        title={`Rate ${store.name}`}>
        <RatingSubmitModal
          store={store}
          onSubmit={async (rating) => {
            await onRatingSubmit(store.id, rating);
            setRatingOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default StoreListingCard;
