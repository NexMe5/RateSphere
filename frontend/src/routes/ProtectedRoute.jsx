import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <Loader fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
