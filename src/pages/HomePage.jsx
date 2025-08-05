import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample attractions
const attractions = [
  {
    id: 1,
    name: "Stone Town",
    image: "icons/img/stone-town.jpg",
    description: "Historic city center of Zanzibar.",
  },
  {
    id: 2,
    name: "Nungwi Beach",
    image: "icons/img/nungwi-beach.avif",
    description: "Famous white sand beach.",
  },
  {
    id: 3,
    name: "Jozani Forest",
    image: "icons/img/jozani.jpg",
    description: "Natural forest reserve.",
  },
  {
    id: 4,
    name: "Pemba Island",
    image: "icons/img/pemba-island.jpeg",
    description: "Beautiful green island north of Unguja.",
  },
];

export default function HomePage() {
  const { userRole } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % attractions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? attractions.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % attractions.length);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md px-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto py-4">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center space-x-4">
              <img
                src="/icons/img/zanzibar-logo.png"
                alt="Zanzibar Tourism Logo"
                className="h-24 w-24 object-contain rounded-full border-4 border-blue-500"
              />
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                Zanzibar Tourism
              </span>
            </Link>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="text-xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Toggle Dark Mode"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? "🌞" : "🌙"}
              </button>

              <Link
                to="/login"
                className="px-4 md:px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 md:px-6 py-2 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition text-sm md:text-base"
              >
                Signup
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 space-y-16">

          {/* Attractions Slider */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center md:text-left">
              Discover Attractions
            </h2>
            <div
              className="relative overflow-hidden rounded-lg shadow-md select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{ height: "300px" }}
            >
              {attractions.map((attraction, index) => (
                <div
                  key={attraction.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none z-0"
                  }`}
                  aria-hidden={index !== currentIndex}
                >
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-72 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg text-center md:text-left">
                    <h3 className="font-semibold text-lg">{attraction.name}</h3>
                    <p className="mt-1 text-sm">{attraction.description}</p>
                    <Link
                      to="#"
                      className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                    >
                      More Info →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-70 transition focus:outline-none"
                aria-label="Previous Slide"
              >
                &#10094;
              </button>
              <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-70 transition focus:outline-none"
                aria-label="Next Slide"
              >
                &#10095;
              </button>

              {/* Slide Dots */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {attractions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full ${
                      idx === currentIndex ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center md:text-left">
              Explore Zanzibar Map
            </h2>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[-6.1659, 39.2026]}
                zoom={9}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[-6.1659, 39.2026]}>
                  <Popup>Unguja Island (Zanzibar main island)</Popup>
                </Marker>
                <Marker position={[-5.255, 39.75]}>
                  <Popup>Pemba Island</Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-10 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Connect With Us
            </h4>
            <div className="flex justify-center space-x-6 text-blue-600 text-xl">
              <a href="https://web.facebook.com/profile.php?id=61578887212241" aria-label="Facebook" className="hover:text-blue-800">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-600">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Zanzibar GIS-BASED Travel Together. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
