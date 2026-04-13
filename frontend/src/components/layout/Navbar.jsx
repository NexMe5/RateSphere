import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">⭐ RateSphere</div>
      <div className="navbar-user">
        <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
        <span className="navbar-role">{user?.role?.replace('_', ' ')}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
