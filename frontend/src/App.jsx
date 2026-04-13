import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRouter from './routes/AppRouter';
import './styles/global.css';
import './styles/variables.css';

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  </AuthProvider>
);

export default App;
