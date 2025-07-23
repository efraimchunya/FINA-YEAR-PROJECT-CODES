import React from 'react';

export default function SiteDetails({ site, onClose }) {
  if (!site) return null;
  return (
    <div style={{
      position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
      background: 'white', padding: 20, boxShadow: '0 0 10px #333', zIndex: 1000, width: '80%', maxHeight: '70%', overflowY: 'auto'
    }}>
      <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>Close</button>
      <h2>{site.name}</h2>
      <p>{site.description}</p>
      <h3>Activities:</h3>
      <ul>
        {site.activities && site.activities.length ? (
          site.activities.map((act, idx) => <li key={idx}>{act.name} - {act.description}</li>)
        ) : (
          <li>No activities listed.</li>
        )}
      </ul>
    </div>
  );
}
