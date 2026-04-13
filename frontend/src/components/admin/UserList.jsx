import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import Table from '../common/Table';
import SearchBar from '../common/SearchBar';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import UserDetailView from './UserDetailView';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address' },
  { key: 'role', label: 'Role', sortable: true, render: (val) => <Badge label={val} /> },
  { key: 'actions', label: 'Actions', render: (_, row) => (
    <button className="btn-link">View</button>
  )},
];

const UserList = () => {
  const { users, loading, fetchUsers } = useUsers();
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    fetchUsers({ sortBy: key, sortOrder: order });
  };

  const searchFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <div className="list-page">
      <SearchBar fields={searchFields} onSearch={fetchUsers} />
      {loading ? <Loader /> : (
        <Table columns={columns} data={users} onSort={handleSort}
          sortKey={sortKey} sortOrder={sortOrder} />
      )}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && <UserDetailView userId={selectedUser} />}
      </Modal>
    </div>
  );
};

export default UserList;
