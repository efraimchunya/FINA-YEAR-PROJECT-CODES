export interface MapPosition {
    lat: number;
    lng: number;
  }
  
  export interface MapMarker {
    id: number;
    position: MapPosition;
    title: string;
    category: string;
    status: string;
  }
  
  export const getMarkerColor = (status: string): string => {
    switch (status) {
      case "active": return "#FF385C"; // Primary red
      case "pending": return "#FFB400"; // Accent yellow  
      case "inactive": return "#6B7280"; // Gray
      default: return "#FF385C";
    }
  };
  
  export const getMarkerIcon = (category: string): string => {
    switch (category) {
      case "Museum":
      case "Art": return "fas fa-camera";
      case "Historical": return "fas fa-monument";
      case "Nature":
      case "Park": return "fas fa-tree";
      case "Coastal": return "fas fa-anchor";
      case "Urban": return "fas fa-building";
      default: return "fas fa-map-marker-alt";
    }
  };
  
  export const calculateMapBounds = (markers: MapMarker[]) => {
    if (markers.length === 0) {
      return null;
    }
  
    let minLat = markers[0].position.lat;
    let maxLat = markers[0].position.lat;
    let minLng = markers[0].position.lng;
    let maxLng = markers[0].position.lng;
  
    markers.forEach(marker => {
      minLat = Math.min(minLat, marker.position.lat);
      maxLat = Math.max(maxLat, marker.position.lat);
      minLng = Math.min(minLng, marker.position.lng);
      maxLng = Math.max(maxLng, marker.position.lng);
    });
  
    return {
      northEast: { lat: maxLat, lng: maxLng },
      southWest: { lat: minLat, lng: minLng }
    };
  };
  
  export const validateCoordinates = (lat: string | undefined, lng: string | undefined): boolean => {
    if (!lat || !lng) return false;
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    return !isNaN(latitude) && 
           !isNaN(longitude) && 
           latitude >= -90 && 
           latitude <= 90 && 
           longitude >= -180 && 
           longitude <= 180;
  };
  
  // Demo positions for map markers when coordinates are not available
  export const getDemoPosition = (index: number): { top: string; left: string } => {
    const positions = [
      { top: '20%', left: '32%' },
      { top: '32%', left: '48%' },
      { top: '28%', left: '64%' },
      { top: '40%', left: '40%' },
      { top: '16%', left: '56%' },
      { top: '36%', left: '72%' },
      { top: '24%', left: '28%' },
      { top: '44%', left: '52%' },
    ];
    
    return positions[index % positions.length];
  };
  