import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStoresApi, submitRatingApi, getOwnerDashboardApi } from '../api/store.api';

export const useStores = (params = {}) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // stabilize params to prevent infinite loops
  const paramsString = JSON.stringify(params);
  const stableParams = useMemo(() => JSON.parse(paramsString), [paramsString]);

  const fetchStores = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getStoresApi({ ...stableParams, ...filters });
      setStores(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const submitRating = async (storeId, rating) => {
    const res = await submitRatingApi(storeId, rating);
    await fetchStores();
    return res.data;
  };

  const addUntrackedStore = async (storeData) => {
    setLoading(true);
    try {
      const res = await import('../api/store.api').then(m => m.addUnclaimedStoreApi(storeData));
      await fetchStores();
      return res.data?.data?.id; 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add untracked store');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, [fetchStores]);

  return { stores, loading, error, fetchStores, submitRating, addUntrackedStore };
};
