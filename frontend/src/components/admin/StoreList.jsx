import { useState, useEffect } from 'react';
import { getStoresApi } from '../../api/admin.api';
import Table from '../common/Table';
import SearchBar from '../common/SearchBar';
import StarRating from '../common/StarRating';
import Loader from '../common/Loader';

const columns = [
  { key: 'name', label: 'Store Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address' },
  { key: 'average_rating', label: 'Rating', sortable: true,
    render: (val) => <StarRating value={Math.round(val)} readOnly size="sm" /> },
];

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = async (params = {}) => {
    setLoading(true);
    const res = await getStoresApi({ sortBy: sortKey, sortOrder, ...params });
    setStores(res.data.data);
    setLoading(false);
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    fetchStores({ sortBy: key, sortOrder: order });
  };

  useEffect(() => { fetchStores(); }, []);

  return (
    <div className="list-page">
      <SearchBar
        fields={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'address', label: 'Address' }]}
        onSearch={fetchStores}
      />
      {loading ? <Loader /> : (
        <Table columns={columns} data={stores} onSort={handleSort}
          sortKey={sortKey} sortOrder={sortOrder} />
      )}
    </div>
  );
};

export default StoreList;
