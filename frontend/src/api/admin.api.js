import axiosInstance from './axiosInstance';
export const getDashboardStatsApi = () => axiosInstance.get('/admin/dashboard');
export const addUserApi = (data) => axiosInstance.post('/admin/users', data);
export const addStoreApi = (data) => axiosInstance.post('/admin/stores', data);
export const getUsersApi = (params) => axiosInstance.get('/admin/users', { params });
export const getStoresApi = (params) => axiosInstance.get('/admin/stores', { params });
export const getUserDetailsApi = (id) => axiosInstance.get(`/admin/users/${id}`);
