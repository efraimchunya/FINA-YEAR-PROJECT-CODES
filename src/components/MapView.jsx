import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ sites, onSiteClick }) => {
  return (
    <div className="space-y-6">
      {/* Site Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            onClick={() => onSiteClick && onSiteClick(site)}
            className="cursor-pointer bg-white dark:bg-gray-700 shadow rounded p-4 hover:ring hover:ring-blue-400 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{site.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{site.description}</p>
          </div>
        ))}
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[-6.1659, 39.2026]}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
        className="rounded shadow"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {sites.map((site) => (
          <Marker key={site.id} position={[site.latitude, site.longitude]}>
            <Popup>
              <strong>{site.name}</strong>
              <br />
              {site.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
