import axiosInstance from './axiosInstance';
export const loginApi = (data) => axiosInstance.post('/auth/login', data);
export const registerApi = (data) => axiosInstance.post('/auth/register', data);
export const getMeApi = () => axiosInstance.get('/auth/me');
export const updatePasswordApi = (data) => axiosInstance.put('/auth/password', data);
export const getProfileApi = () => axiosInstance.get('/auth/profile');
