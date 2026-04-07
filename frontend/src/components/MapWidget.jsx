import React from 'react';
import { Map } from 'lucide-react';

const MapWidget = ({ city }) => {
  if (!city) return null;

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(city)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="forecast-glass" style={{ marginTop: '20px', marginBottom: '40px' }}>
      <div className="forecast-header">
        <Map size={16} /> INTERACTIVE MAP
      </div>
      <div style={{ height: '250px', width: '100%', marginTop: '15px', borderRadius: '12px', overflow: 'hidden' }}>
        <iframe
          title={`Map of ${city}`}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={src}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapWidget;
