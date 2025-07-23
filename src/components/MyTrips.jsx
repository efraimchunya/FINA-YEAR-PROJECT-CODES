import React, { useState } from 'react';

const MyTrips = ({ sites }) => {
  const [tripSites, setTripSites] = useState([]);

  const addToTrip = (site) => {
    if (!tripSites.includes(site)) {
      setTripSites([...tripSites, site]);
    }
  };

  const removeFromTrip = (siteId) => {
    setTripSites(tripSites.filter((site) => site.id !== siteId));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>
      <ul>
        {tripSites.map((site) => (
          <li key={site.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{site.name}</span>
              <button onClick={() => removeFromTrip(site.id)} className="text-red-500">Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-6 mb-2">Available Sites</h3>
      <ul>
        {sites.map((site) => (
          <li key={site.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{site.name}</span>
              <button onClick={() => addToTrip(site)} className="text-green-500">Add to Trip</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTrips;
