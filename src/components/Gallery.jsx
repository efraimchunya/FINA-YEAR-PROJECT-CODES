import React from 'react';

const Gallery = ({ sites }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {sites.map((site) => (
          <div key={site.id} className="border p-2">
            <img src={site.imageUrl} alt={site.name} className="w-full h-32 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{site.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
