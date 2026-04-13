import { useEffect, useState } from 'react';
import { getOwnerDashboardApi } from '../../api/store.api';
import StarRating from '../common/StarRating';
import RatersList from './RatersList';
import Loader from '../common/Loader';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerDashboardApi()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p>No store data found.</p>;

  return (
    <div className="owner-dashboard">
      <div className="owner-store-summary">
        <h2>{data.store.name}</h2>
        <p>📍 {data.store.address}</p>
        <div className="owner-rating">
          <StarRating value={Math.round(data.store.average_rating)} readOnly size="lg" />
          <span className="rating-number">{Number(data.store.average_rating).toFixed(2)} / 5</span>
          <span className="rating-count">({data.store.total_ratings} ratings)</span>
        </div>
      </div>
      <RatersList raters={data.raters} />
    </div>
  );
};

export default OwnerDashboard;
