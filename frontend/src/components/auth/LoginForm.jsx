import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const ROLE_REDIRECT = {
  admin: '/admin',
  normal_user: '/stores',
  store_owner: '/owner',
};

const LoginForm = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password) errs.password = 'Password required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      addToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      navigate(ROLE_REDIRECT[user.role] || '/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <Input label="Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
      <Button fullWidth loading={loading} onClick={handleSubmit}>Sign In</Button>
    </div>
  );
};

export default LoginForm;
