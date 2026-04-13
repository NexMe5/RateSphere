import axiosInstance from './axiosInstance';
export const getStoresApi = (params) => axiosInstance.get('/stores', { params });
export const submitRatingApi = (storeId, rating) => axiosInstance.post(`/stores/${storeId}/rate`, { rating });
export const getOwnerDashboardApi = () => axiosInstance.get('/stores/owner/dashboard');
export const addUnclaimedStoreApi = (data) => axiosInstance.post('/stores/unclaimed', data);
