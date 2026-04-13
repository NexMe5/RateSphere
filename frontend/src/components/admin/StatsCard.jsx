const StatsCard = ({ icon, label, value, color = 'primary' }) => (
  <div className={`stats-card stats-card--${color}`}>
    <div className="stats-icon">{icon}</div>
    <div className="stats-info">
      <span className="stats-value">{value?.toLocaleString()}</span>
      <span className="stats-label">{label}</span>
    </div>
  </div>
);

export default StatsCard;
