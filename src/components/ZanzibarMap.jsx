import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon path for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export function ZanzibarMap({
  locations = [],
  activities = [],
  onMapClick,
  onAddActivity,
  onBookActivity,
  mode = "tourist",
}) {
  return (
    <MapContainer
      center={[-6.1659, 39.2026]}
      zoom={10}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mode === "admin" && <AddLocationHandler onMapClick={onMapClick} />}
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            {loc.description}
            <br />
            {mode === "operator" && (
              <button onClick={() => onAddActivity(loc.id)}>Add Activity</button>
            )}
            {mode === "tourist" &&
              activities
                .filter((a) => a.location_id === loc.id)
                .map((a) => (
                  <div key={a.id} style={{ marginTop: "8px" }}>
                    <b>{a.name}</b>
                    <br />
                    {a.description}
                    <br />
                    Price: ${a.price}
                    <br />
                    {/* Pass location_id and activity_id separately */}
                    <button onClick={() => onBookActivity(loc.id, a.id)}>
                      Book
                    </button>
                  </div>
                ))}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function AddLocationHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}
