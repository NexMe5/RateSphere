import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../../hooks/useToast';
import Input from '../common/Input';
import Button from '../common/Button';

const AddUserForm = ({ onSuccess }) => {
  const { addUser } = useUsers();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'', role:'normal_user' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addUser(form);
      addToast('User added successfully', 'success');
      onSuccess?.();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-stack">
      <Input label="Full Name (20-60 chars)" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Input label="Address" value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <div className="form-group">
        <label>Role</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="normal_user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>
      <Button fullWidth loading={loading} onClick={handleSubmit}>Add User</Button>
    </div>
  );
};

export default AddUserForm;
