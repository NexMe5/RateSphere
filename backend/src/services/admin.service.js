const supabase = require('../config/supabase');
const { hashPassword } = require('../utils/hashPassword');

const getDashboardStats = async () => {
  const [usersResult, storesResult, ratingsResult] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('stores').select('id', { count: 'exact', head: true }),
    supabase.from('ratings').select('id', { count: 'exact', head: true }),
  ]);
  return {
    totalUsers: usersResult.count,
    totalStores: storesResult.count,
    totalRatings: ratingsResult.count,
  };
};

const addUser = async ({ name, email, password, address, role = 'normal_user' }) => {
  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash, address, role }])
    .select('id, name, email, role, address')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const addStore = async ({ name, email, address, owner_id }) => {
  const { data, error } = await supabase
    .from('stores')
    .insert([{ name, email, address, owner_id }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const getUsers = async ({ name, email, address, role, sortBy = 'name', sortOrder = 'asc' }) => {
  let query = supabase
    .from('users')
    .select('id, name, email, address, role');
  if (name) query = query.ilike('name', `%${name}%`);
  if (email) query = query.ilike('email', `%${email}%`);
  if (address) query = query.ilike('address', `%${address}%`);
  if (role) query = query.eq('role', role);
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

const getStores = async ({ name, email, address, sortBy = 'name', sortOrder = 'asc' }) => {
  let query = supabase.from('stores_with_rating').select('*');
  if (name) query = query.ilike('name', `%${name}%`);
  if (email) query = query.ilike('email', `%${email}%`);
  if (address) query = query.ilike('address', `%${address}%`);
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

const getUserDetails = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, address, role')
    .eq('id', userId)
    .single();
  if (error) throw new Error('User not found');

  if (user.role === 'store_owner') {
    const { data: store } = await supabase
      .from('stores_with_rating')
      .select('average_rating')
      .eq('owner_id', userId)
      .single();
    user.store_rating = store?.average_rating ?? 0;
  }
  return user;
};

module.exports = { getDashboardStats, addUser, addStore, getUsers, getStores, getUserDetails };
