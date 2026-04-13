import { useAuthContext } from '../context/AuthContext';
import { loginApi, registerApi, updatePasswordApi } from '../api/auth.api';

export const useAuth = () => {
  const { user, token, loading, login, logout } = useAuthContext();

  const handleLogin = async (credentials) => {
    const res = await loginApi(credentials);
    const { token, user } = res.data.data;
    login(token, user);
    return user;
  };

  const handleRegister = async (formData) => {
    const res = await registerApi(formData);
    return res.data;
  };

  const handleUpdatePassword = async (data) => {
    const res = await updatePasswordApi(data);
    return res.data;
  };

  return { user, token, loading, login: handleLogin, register: handleRegister, logout, updatePassword: handleUpdatePassword };
};
