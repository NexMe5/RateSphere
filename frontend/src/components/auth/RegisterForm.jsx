import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60)
      errs.name = 'Name must be 20–60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Valid email required';
    if (!form.password || form.password.length < 8 || form.password.length > 16 ||
      !/[A-Z]/.test(form.password) || !/[!@#$%^&*]/.test(form.password))
      errs.password = 'Password: 8-16 chars, 1 uppercase, 1 special char';
    if (form.address && form.address.length > 400)
      errs.address = 'Max 400 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      addToast('Account created! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <Input label="Full Name (20–60 chars)" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <Input label="Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
      <Input label="Address (optional)" value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} />
      <Button fullWidth loading={loading} onClick={handleSubmit}>Create Account</Button>
      <p className="auth-switch">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
};

export default RegisterForm;
