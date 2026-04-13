import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthContext();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default RoleBasedRoute;
