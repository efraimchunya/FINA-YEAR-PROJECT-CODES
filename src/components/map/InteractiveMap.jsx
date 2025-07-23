import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryFilter } from "./category-filter";
import { SearchBox } from "./search-box";
import { SiteDetailsModal } from "./site-details-modal";
import { Card, CardContent } from "../ui/Card";

// Leaflet imports
import L from "leaflet";
if (typeof window !== "undefined" && !window.L) {
  window.L = L;
}

export function InteractiveMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([
    "beach",
    "cultural",
    "historical",
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sites, isLoading } = useQuery({
    queryKey: [
      "/api/sites",
      {
        category:
          selectedCategories.length === 3
            ? undefined
            : selectedCategories.join(","),
        search: searchQuery || undefined,
      },
    ],
  });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.L &&
      !mapInstanceRef.current
    ) {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = window.L.map(mapRef.current).setView([-6.1659, 39.1917], 10);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      beach: "🏖️",
      cultural: "🕌",
      historical: "🏛️",
    };
    return window.L.divIcon({
      html: `<div style="
        background: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid #0EA5E9;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      ">${icons[category] || "📍"}</div>`,
      className: "custom-div-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  const addMarkersToMap = () => {
    if (!mapInstanceRef.current || !sites || !window.L) return;

    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    sites.forEach((site) => {
      if (selectedCategories.includes(site.category)) {
        const icon = getCategoryIcon(site.category);
        const marker = window.L.marker(
          [parseFloat(site.latitude), parseFloat(site.longitude)],
          { icon }
        ).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="marker-popup">
            <h3 style="font-weight:bold;font-size:1.125rem;margin-bottom:0.5rem;">
              ${site.title}
            </h3>
            <p style="font-size:0.875rem;color:#4B5563;margin-bottom:0.5rem;">
              ${site.description.substring(0, 100)}...
            </p>
            <p style="font-size:0.75rem;color:#6B7280;margin-bottom:0.75rem;">
              📍 ${parseFloat(site.latitude).toFixed(4)}, ${parseFloat(
          site.longitude
        ).toFixed(4)}
            </p>
            <button 
              onclick="window.showSiteDetails(${site.id})"
              style="
                background:#3B82F6;color:white;padding:0.5rem 1rem;
                border-radius:0.375rem;font-size:0.875rem;
                border:none;cursor:pointer;
              "
            >
              View Details
            </button>
          </div>
        `);

        markersRef.current.push(marker);
      }
    });
  };

  useEffect(() => {
    window.showSiteDetails = (siteId) => {
      const site = sites?.find((s) => s.id === siteId);
      if (site) {
        setSelectedSite(site);
      }
    };
  }, [sites]);

  useEffect(() => {
    if (sites) {
      addMarkersToMap();
    }
  }, [sites, selectedCategories]);

  useEffect(() => {
    if (
      mapInstanceRef.current &&
      sites &&
      sites.length > 0 &&
      searchQuery
    ) {
      const bounds = window.L.latLngBounds(
        sites.map((site) => [
          parseFloat(site.latitude),
          parseFloat(site.longitude),
        ])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [sites, searchQuery]);

  if (isLoading) {
    return (
      <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-6 right-6 z-40 bg-white rounded-lg shadow-lg p-4 min-w-64">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search locations..."
        />
        <div className="mt-4">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>
      </div>

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg"
        style={{ minHeight: "400px" }}
      />

      {selectedSite && (
        <SiteDetailsModal
          site={selectedSite}
          isOpen={!!selectedSite}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </div>
  );
}
