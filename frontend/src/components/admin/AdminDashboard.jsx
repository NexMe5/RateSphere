import { useEffect, useState } from 'react';
import { getDashboardStatsApi } from '../../api/admin.api';
import StatsCard from './StatsCard';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsApi()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-stats">
      <StatsCard icon="👥" label="Total Users" value={stats?.totalUsers} color="primary" />
      <StatsCard icon="🏪" label="Total Stores" value={stats?.totalStores} color="accent" />
      <StatsCard icon="⭐" label="Total Ratings" value={stats?.totalRatings} color="success" />
    </div>
  );
};

export default AdminDashboard;
