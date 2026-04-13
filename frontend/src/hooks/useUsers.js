import { useState, useEffect } from 'react';
import { getUsersApi, getUserDetailsApi, addUserApi } from '../api/admin.api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    const res = await getUsersApi(params);
    setUsers(res.data.data);
    setLoading(false);
  };

  const getUserDetails = async (id) => {
    const res = await getUserDetailsApi(id);
    return res.data.data;
  };

  const addUser = async (data) => {
    const res = await addUserApi(data);
    await fetchUsers();
    return res.data;
  };

  useEffect(() => { fetchUsers(); }, []);

  return { users, loading, fetchUsers, getUserDetails, addUser };
};
