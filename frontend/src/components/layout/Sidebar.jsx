import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const roleLinks = {
  admin: [
    { to: '/admin', label: '📊 Dashboard' },
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/stores', label: '🏪 Stores' },
  ],
  normal_user: [
    { to: '/stores', label: '🏪 Browse Stores' },
    { to: '/profile', label: '👤 My Profile' },
  ],
  store_owner: [
    { to: '/owner', label: '📊 My Dashboard' },
    { to: '/profile', label: '👤 My Profile' },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const links = roleLinks[user?.role] || [];
  return (
    <aside className="sidebar">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
