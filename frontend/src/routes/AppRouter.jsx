import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import StoreOwnerDashboardPage from '../pages/StoreOwnerDashboardPage';
import UserProfilePage from '../pages/UserProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </RoleBasedRoute>
        </ProtectedRoute>
      } />

      <Route path="/stores" element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={['normal_user']}>
            <UserDashboardPage />
          </RoleBasedRoute>
        </ProtectedRoute>
      } />

      <Route path="/owner" element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={['store_owner']}>
            <StoreOwnerDashboardPage />
          </RoleBasedRoute>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
