const roleColors = { admin: 'purple', normal_user: 'blue', store_owner: 'green' };

const Badge = ({ label, variant }) => (
  <span className={`badge badge--${variant || roleColors[label] || 'gray'}`}>
    {label?.replace('_', ' ')}
  </span>
);

export default Badge;
