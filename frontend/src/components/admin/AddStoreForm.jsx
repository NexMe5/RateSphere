import { useState } from 'react';
import { addStoreApi } from '../../api/admin.api';
import { useToast } from '../../hooks/useToast';
import Input from '../common/Input';
import Button from '../common/Button';

const AddStoreForm = ({ onSuccess }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name:'', email:'', address:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addStoreApi(form);
      addToast('Store added successfully', 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add store', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-stack">
      <Input label="Store Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Address" value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Button fullWidth loading={loading} onClick={handleSubmit}>Add Store</Button>
    </div>
  );
};

export default AddStoreForm;
