import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import SiteDetails from './SiteDetails';
import { fetchSites, fetchCategories } from '../utils/api';

// Example icons per category
const iconUrls = {
  Beaches: 'https://cdn-icons-png.flaticon.com/512/69/69524.png',
  Cultural: 'https://cdn-icons-png.flaticon.com/512/1704/1704107.png',
  Historical: 'https://cdn-icons-png.flaticon.com/512/1063/1063400.png',
  default: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
};

function createIcon(category) {
  return new L.Icon({
    iconUrl: iconUrls[category] || iconUrls.default,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

export default function Map() {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const sitesRes = await fetchSites();
        setSites(sitesRes.data);

        const catsRes = await fetchCategories();
        setCategories(catsRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    }
    loadData();
  }, []);

  const filteredSites = sites.filter(site => {
    const matchesCategory = filterCategory ? site.category === filterCategory : true;
    const matchesSearch =
      site.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (site.activities && site.activities.some(a => a.name.toLowerCase().includes(searchText.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Default map center Zanzibar coords
  const center = [-6.165916, 39.202644];

  return (
    <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'white', padding: 10, borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.2)', width: 250 }}>
        <CategoryFilter categories={categories} selectedCategory={filterCategory} onChange={setFilterCategory} />
        <SearchBar searchText={searchText} onSearchChange={setSearchText} />
      </div>

      <MapContainer center={center} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <ZoomControl position="topright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        {filteredSites.map(site => (
          <Marker
            key={site.id}
            position={[site.location.lat, site.location.lng]}
            icon={createIcon(site.category)}
            eventHandlers={{
              click: () => setSelectedSite(site),
            }}
          />
        ))}
      </MapContainer>

      {selectedSite && (
        <SiteDetails site={selectedSite} onClose={() => setSelectedSite(null)} />
      )}
    </div>
  );
}
