import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom blue dot for user location
const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div style="background-color: blue; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Grey icon for untracked locations
const untrackedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

const SearchNearbyControls = ({ onSearch }) => {
  const map = useMap();
  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <button
        onClick={(e) => { e.preventDefault(); onSearch(map.getBounds(), map.getZoom()); }}
        style={{ padding: '8px 12px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
      >
        Find Untracked Places Here
      </button>
    </div>
  );
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // NYC

const MapLocator = ({ stores, onLocationUpdate, onTrackStore, onPOIsFetched }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [untrackedPOIs, setUntrackedPOIs] = useState([]);
  const [poiLoading, setPoiLoading] = useState(false);
  const [tempRating, setTempRating] = useState(0);

  const handleTrackSubmit = (poi) => {
    if (tempRating === 0) {
      alert("Please select a star rating first!");
      return;
    }
    onTrackStore(poi, tempRating);
    setUntrackedPOIs(prev => prev.filter(p => p.osm_id !== poi.osm_id));
    setTempRating(0); // reset
  };

  useEffect(() => {
    if (onPOIsFetched) {
      onPOIsFetched(untrackedPOIs);
    }
  }, [untrackedPOIs, onPOIsFetched]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCenter(loc);
          if (onLocationUpdate) onLocationUpdate({ userLat: loc.lat, userLng: loc.lng });
        },
        () => console.warn('Geolocation denied or unavailable')
      );
    }
  }, [onLocationUpdate]);

  // Debounced nominatim search
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching geocode: ', error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setSearchQuery(place.display_name);
    setSuggestions([]);
    setCenter({ lat, lng });
    if (onLocationUpdate) onLocationUpdate({ userLat: lat, userLng: lng });
  };

  const handleOverpassSearch = async (bounds, zoom) => {
    if (zoom && zoom < 14) {
      alert("Area too large! Please zoom in closer to the map to find places.");
      return;
    }
    setPoiLoading(true);
    const s = bounds.getSouth();
    const n = bounds.getNorth();
    const w = bounds.getWest();
    const e = bounds.getEast();

    // Search for important stores/amenities. Limit shop to major types to avoid timeouts.
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|fast_food|bar|pub|ice_cream|pharmacy|clinic|hospital"](${s},${w},${n},${e});
        node["shop"~"supermarket|convenience|department_store|clothes|electronics|bakery|butcher|mall"](${s},${w},${n},${e});
      );
      out center;
    `;
    const url = 'https://overpass-api.de/api/interpreter';

    try {
      const res = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(query) });
      const data = await res.json();

      const pois = (data.elements || []).map(el => ({
        osm_id: el.id.toString(),
        name: el.tags.name,
        type: el.tags.amenity || el.tags.shop,
        lat: el.lat,
        lng: el.lon,
        address: [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || 'Unknown Address'
      })).filter(el => el.name); // must have a name

      // Filter out POIs that are already tracked in 'stores' prop
      const trackedOsmIds = new Set(stores.map(s => s.osm_id).filter(Boolean));
      const filteredPois = pois.filter(p => !trackedOsmIds.has(p.osm_id));

      setUntrackedPOIs(filteredPois);
      if (filteredPois.length === 0) alert("No new local spots found in this area.");
    } catch (err) {
      console.error("Overpass API error:", err);
      alert("Failed to fetch nearby unrated places.");
    } finally {
      setPoiLoading(false);
    }
  };



  return (
    <div className="map-locator" style={{ marginBottom: '24px' }}>
      <div className="search-box-map" style={{ marginBottom: '12px', position: 'relative', zIndex: 1000 }}>
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) setSuggestions([]);
          }}
          placeholder="Enter a location to find nearest stores..."
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'white' }}
        />
        {suggestions.length > 0 && (
          <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-bg-card)', listStyle: 'none', padding: '10px', borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
            {suggestions.map((place) => (
              <li key={place.place_id} onClick={() => handleSelect(place)} style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid var(--color-border)', color: 'white' }}>
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: '500px', borderRadius: '12px', zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={center} />
          <SearchNearbyControls onSearch={handleOverpassSearch} />

          <Marker position={center} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Tracked Stores */}
          {stores.map((store) => (
            store.lat && store.lng && (
              <Marker
                key={store.id}
                position={{ lat: Number(store.lat), lng: Number(store.lng) }}
              >
                <Popup>
                  <div style={{ color: 'black' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{store.name}</h4>
                    <p style={{ margin: 0 }}>📍 {store.address}</p>
                    <p style={{ margin: '5px 0 0 0' }}>⭐ {Number(store.average_rating || 0).toFixed(1)} / 5</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Untracked POIs */}
          {untrackedPOIs.map((poi) => (
            <Marker key={poi.osm_id} position={{ lat: poi.lat, lng: poi.lng }} icon={untrackedIcon}>
              <Popup>
                <div style={{ color: 'black', width: '200px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{poi.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>Type: {poi.type}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>📍 {poi.address}</p>
                  <hr style={{ margin: '8px 0' }} />
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Rate & Track this place</p>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() => setTempRating(star)}
                        style={{ cursor: 'pointer', fontSize: '1.2em', color: star <= tempRating ? 'orange' : '#ccc' }}
                      >★</span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleTrackSubmit(poi)}
                    style={{ width: '100%', padding: '6px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Submit Rating
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {poiLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, borderRadius: '12px', pointerEvents: 'none' }}>
            <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>Searching Area...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLocator;
