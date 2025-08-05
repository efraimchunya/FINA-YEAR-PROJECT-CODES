import React, { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Backend base URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Helper to get full image URL
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function ZanzibarMap({
  locations = [],
  activities = [],
  onMapClick,
  onAddActivity,
  onBookActivity,
  mode = "tourist",
}) {
  // ✅ Normalize locations to always be an array
  const safeLocations = Array.isArray(locations)
    ? locations
    : locations?.locations || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalImage, setModalImage] = useState(null); // modal state

  // Extract unique categories from safeLocations
  const categories = useMemo(() => {
    const unique = new Set(
      safeLocations
        .map((loc) => loc.category?.toLowerCase()?.trim())
        .filter(Boolean)
    );
    return Array.from(unique);
  }, [safeLocations]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return safeLocations.filter((loc) => {
      const category = loc.category?.toLowerCase()?.trim();
      const matchesCategory =
        selectedCategory === "" || category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activities.some(
          (a) =>
            a.location_id === loc.id &&
            a.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [safeLocations, activities, searchTerm, selectedCategory]);

  const isFiltered = (locId) =>
    filteredLocations.findIndex((l) => l.id === locId) !== -1;

  return (
    <div className="relative">
      {/* Filters */}
      <div className="absolute z-[999] top-2 right-2 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg space-y-2">
        <input
          type="text"
          placeholder="Search locations or activities"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
          aria-label="Search locations or activities"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 py-1 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

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

        {safeLocations.map((loc) =>
          loc?.lat != null && loc?.lng != null ? (
            <React.Fragment key={loc.id}>
              {/* Highlight filtered locations */}
              {isFiltered(loc.id) && (
                <CircleMarker
                  center={[loc.lat, loc.lng]}
                  radius={20}
                  pathOptions={{
                    color: "red",
                    fillColor: "transparent",
                    fillOpacity: 0,
                    weight: 6,
                    dashArray: "12 15",
                  }}
                />
              )}

              <Marker position={[loc.lat, loc.lng]}>
                <Popup>
                  <strong>{loc.name}</strong>
                  <br />
                  {loc.description}
                  <br />
                  <i style={{ fontSize: "0.8rem" }}>
                    Category: {loc.category}
                  </i>
                  <br />

                  {/* Show uploaded image if exists */}
                  {loc.imageurl && (
                    <img
                      src={getImageUrl(loc.imageurl)}
                      alt={loc.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginTop: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => setModalImage(getImageUrl(loc.imageurl))}
                    />
                  )}

                  {/* Operator mode: Add Activity button */}
                  {mode === "operator" && (
                    <button
                      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => onAddActivity(loc.id)}
                    >
                      Add Activity
                    </button>
                  )}

                  {/* Tourist mode: list activities with Book buttons */}
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
                          <button
                            className="mt-1 px-2 py-1 bg-green-500 text-white rounded"
                            onClick={() => onBookActivity(loc.id, a.id)}
                          >
                            Book
                          </button>
                        </div>
                      ))}
                </Popup>
              </Marker>
            </React.Fragment>
          ) : null
        )}
      </MapContainer>

      {/* Modal for image popup */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000]"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Location"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
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
