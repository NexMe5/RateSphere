const supabase = require('../config/supabase');

const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getAllStores = async ({ name, address, userId, sortBy = 'name', sortOrder = 'asc', userLat, userLng }) => {
  let query = supabase.from('stores_with_rating').select('*');
  if (name) query = query.ilike('name', `%${name}%`);
  if (address) query = query.ilike('address', `%${address}%`);
  // If not sorting by distance, sort alphabetically
  if (!userLat || !userLng) {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  }

  let { data: stores, error } = await query;
  if (error) throw new Error(error.message);

  if (userLat && userLng) {
    stores = stores.map(s => ({
      ...s,
      distance: getDistance(Number(userLat), Number(userLng), Number(s.lat), Number(s.lng))
    }));
    // Sort by distance ascending
    stores.sort((a, b) => a.distance - b.distance);
  }

  if (userId && stores.length) {
    const storeIds = stores.map((s) => s.id);
    const { data: userRatings } = await supabase
      .from('ratings')
      .select('store_id, rating')
      .eq('user_id', userId)
      .in('store_id', storeIds);

    const ratingMap = {};
    (userRatings || []).forEach((r) => { ratingMap[r.store_id] = r.rating; });
    return stores.map((s) => ({ ...s, user_rating: ratingMap[s.id] ?? null }));
  }
  return stores;
};

const submitRating = async ({ userId, storeId, rating }) => {
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('user_id', userId)
    .eq('store_id', storeId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('ratings')
      .update({ rating })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { action: 'updated', data };
  }

  const { data, error } = await supabase
    .from('ratings')
    .insert([{ user_id: userId, store_id: storeId, rating }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { action: 'created', data };
};

const getOwnerDashboard = async (ownerId) => {
  const { data: store, error } = await supabase
    .from('stores_with_rating')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  if (error || !store) throw new Error('Store not found for this owner');

  const { data: raters } = await supabase
    .from('ratings')
    .select('rating, user:users(id, name, email)')
    .eq('store_id', store.id);

  return { store, raters: raters || [] };
};

const addUnclaimedStore = async ({ name, address, lat, lng, osm_id }) => {
  // Check if store already exists by osm_id
  const { data: existingStore } = await supabase
    .from('stores')
    .select('id')
    .eq('osm_id', osm_id)
    .single();
    
  if (existingStore) return existingStore;
  
  // Insert new unclaimed store
  const { data, error } = await supabase
    .from('stores')
    .insert([{ 
      name, 
      address, 
      lat, 
      lng, 
      osm_id, 
      store_type: 'unclaimed' 
    }])
    .select('id')
    .single();
    
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getAllStores, submitRating, getOwnerDashboard, addUnclaimedStore };
