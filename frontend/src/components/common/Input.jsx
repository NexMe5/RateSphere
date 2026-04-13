const Input = ({ label, error, icon, ...props }) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <div className="input-inner">
      {icon && <span className="input-icon">{icon}</span>}
      <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
    </div>
    {error && <span className="input-error-msg">{error}</span>}
  </div>
);

export default Input;
