const Button = ({
  children,
  variant = 'primary',    // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',            // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full' : '',
        loading ? 'loading' : '',
      ].join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
};

export default Button;
