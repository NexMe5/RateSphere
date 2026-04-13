import { useState, useCallback } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import StoreListingCard from '../components/user/StoreListingCard';
import MapLocator from '../components/user/MapLocator';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import { useStores } from '../hooks/useStores';
import RatingSubmitModal from '../components/user/RatingSubmitModal';
import Modal from '../components/common/Modal';

const UntrackedStoreCard = ({ poi, onTrack }) => {
  const [ratingOpen, setRatingOpen] = useState(false);
  return (
    <div className="store-card" style={{ border: '2px dashed #888' }}>
      <div className="store-card-header">
        <h3 className="store-name" style={{ color: '#ccc' }}>{poi.name} <span style={{ fontSize: '0.6em', color: '#888' }}>({poi.type})</span></h3>
      </div>
      <p className="store-address">📍 {poi.address}</p>
      <div className="store-card-footer">
        <div className="store-rating-info">
          <span style={{ color: '#aaa', fontStyle: 'italic' }}>New Location</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setRatingOpen(true)}>
          Rate & Track
        </button>
      </div>
      <Modal isOpen={ratingOpen} onClose={() => setRatingOpen(false)} title={`Rate ${poi.name}`}>
        <RatingSubmitModal
          store={poi}
          onSubmit={async (rating) => {
            await onTrack(poi, rating);
            setRatingOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

const UserDashboardPage = () => {
  const { stores, loading, fetchStores, submitRating, addUntrackedStore } = useStores();
  const [untrackedPOIs, setUntrackedPOIs] = useState([]);
  const [poiFilter, setPoiFilter] = useState('All');

  const filteredPOIs = untrackedPOIs.filter(poi => {
    if (poiFilter === 'All') return true;
    if (poiFilter === 'Food') return ['restaurant', 'cafe', 'fast_food', 'bar', 'pub', 'ice_cream'].includes(poi.type);
    if (poiFilter === 'Medical') return ['pharmacy', 'clinic', 'hospital'].includes(poi.type);
    if (poiFilter === 'Shopping') return ['shop', 'mall', 'supermarket', 'convenience'].includes(poi.type);
    return true;
  });

  // Handle location update from map/geolocation
  const handleLocationUpdate = useCallback((locationData) => {
    fetchStores(locationData);
  }, [fetchStores]);

  // Handle tracking a new map POI
  const handleTrackStore = useCallback(async (storeData, rating) => {
    try {
      const storeId = await addUntrackedStore(storeData);
      if (rating) {
        await submitRating(storeId, rating);
      }
      alert('Store added and rated successfully!');
    } catch (err) {
      alert('Failed to rate store. It might already be tracked.');
    }
  }, [addUntrackedStore, submitRating]);

  return (
    <PageWrapper>
      <div className="page-header">
        <h1>Browse Nearby Stores</h1>
      </div>

      <MapLocator
        stores={stores}
        id="storeMap"
        onLocationUpdate={handleLocationUpdate}
        onTrackStore={handleTrackStore}
        onPOIsFetched={setUntrackedPOIs}
      />

      <SearchBar
        placeholder="Filter stores by name or address..."
        fields={[{ key: 'name', label: 'Name' }, { key: 'address', label: 'Address' }]}
        onSearch={fetchStores}
      />

      {untrackedPOIs.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Discovered Places (Not yet rated)</h3>
            <select
              value={poiFilter}
              onChange={(e) => setPoiFilter(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', background: 'var(--color-bg-card)', color: 'white', border: '1px solid var(--color-border)' }}
            >
              <option value="All">All Categories</option>
              <option value="Food">Food & Drink</option>
              <option value="Medical">Medical Stores</option>
              <option value="Shopping">Shopping & Gen. Stores</option>
            </select>
          </div>
          <div className="store-grid" style={{ marginBottom: '30px' }}>
            {filteredPOIs.length > 0 ? filteredPOIs.map((poi) => (
              <UntrackedStoreCard key={poi.osm_id} poi={poi} onTrack={handleTrackStore} />
            )) : <p style={{ color: '#888' }}>No places match this category in the current search area.</p>}
          </div>
        </div>
      )}

      <h3>Tracked Stores</h3>
      {loading ? <Loader /> : (
        <div className="store-grid">
          {stores.map((store) => (
            <StoreListingCard key={store.id} store={store} onRatingSubmit={submitRating} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default UserDashboardPage;
