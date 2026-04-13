const supabase = require('../config/supabase');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

const registerUser = async ({ name, email, password, address }) => {
  const { data: existing } = await supabase
    .from('users').select('id').eq('email', email).single();
  if (existing) throw new Error('Email already registered');

  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash, address, role: 'normal_user' }])
    .select('id, name, email, role, address')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const loginUser = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from('users').select('*').eq('email', email).single();
  if (error || !user) throw new Error('Invalid credentials');

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, role: user.role, email: user.email });
  const { password_hash, ...safeUser } = user;
  return { token, user: safeUser };
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const { data: user } = await supabase
    .from('users').select('password_hash').eq('id', userId).single();
  if (!user) throw new Error('User not found');

  const isValid = await comparePassword(currentPassword, user.password_hash);
  if (!isValid) throw new Error('Current password is incorrect');

  const password_hash = await hashPassword(newPassword);
  const { error } = await supabase
    .from('users').update({ password_hash }).eq('id', userId);
  if (error) throw new Error(error.message);
  return true;
};

const getProfileData = async (userId) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role, address, created_at')
    .eq('id', userId)
    .single();
  if (userError || !user) throw new Error('User not found');

  const { data: ratings, error: ratingsError } = await supabase
    .from('ratings')
    .select(`
      id, rating, created_at,
      store_id,
      stores ( name, address, store_type )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (ratingsError) throw new Error(ratingsError.message);

  const totalPoints = (ratings || []).length * 10;

  return { user, ratings, totalPoints };
};

module.exports = { registerUser, loginUser, updatePassword, getProfileData };
