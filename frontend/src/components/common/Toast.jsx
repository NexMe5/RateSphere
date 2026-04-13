import { useToastContext } from '../../context/ToastContext';

const Toast = () => {
  const { toasts } = useToastContext();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
