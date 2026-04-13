import PageWrapper from '../components/layout/PageWrapper';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserList from '../components/admin/UserList';
import StoreList from '../components/admin/StoreList';
import AddUserForm from '../components/admin/AddUserForm';
import AddStoreForm from '../components/admin/AddStoreForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useState } from 'react';

const AdminDashboardPage = () => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  return (
    <PageWrapper>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <div className="page-actions">
          <Button size="sm" onClick={() => setAddUserOpen(true)}>+ Add User</Button>
          <Button size="sm" variant="secondary" onClick={() => setAddStoreOpen(true)}>+ Add Store</Button>
        </div>
      </div>

      <AdminDashboard />

      <div className="tabs">
        <button className={`tab ${activeTab === 'users' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('users')}>Users</button>
        <button className={`tab ${activeTab === 'stores' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('stores')}>Stores</button>
      </div>

      {activeTab === 'users' && <UserList />}
      {activeTab === 'stores' && <StoreList />}

      <Modal isOpen={addUserOpen} onClose={() => setAddUserOpen(false)} title="Add New User">
        <AddUserForm onSuccess={() => setAddUserOpen(false)} />
      </Modal>

      <Modal isOpen={addStoreOpen} onClose={() => setAddStoreOpen(false)} title="Add New Store">
        <AddStoreForm onSuccess={() => setAddStoreOpen(false)} />
      </Modal>
    </PageWrapper>
  );
};

export default AdminDashboardPage;
