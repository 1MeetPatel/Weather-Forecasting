import React, { useEffect } from 'react';

const generateParticles = (count, className) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={className}
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `-${Math.random() * 2}s`,
        opacity: Math.random() * 0.5 + 0.3
      }}
    />
  ));
};

const CloudSvg = ({ opacity }) => (
  <svg width="200" height="100" viewBox="0 0 200 100" fill="white" style={{ opacity }}>
    <path d="M50 80 Q30 80 30 60 Q30 40 50 40 Q60 20 90 20 Q120 20 130 40 Q150 40 150 60 Q150 80 130 80 Z" />
  </svg>
);

const cloudStyle = (scale, duration, top, delay = 0) => ({
  position: 'absolute',
  top,
  left: 0,
  transform: `scale(${scale})`,
  animation: `cloud-float ${duration}s linear infinite`,
  animationDelay: `${delay}s`,
  willChange: 'transform'
});

const WeatherBackground = ({ condition }) => {
  const mainCondition = condition?.toLowerCase() || 'clear';

  let colors = { top: '#1e88e5', bottom: '#64b5f6' }; 
  let elements = [];

  if (mainCondition.includes('cloud')) {
    colors = { top: '#607D8B', bottom: '#90A4AE' };
    elements = (
      <>
        <div style={cloudStyle(1.2, 45, '10%', -10)}><CloudSvg opacity={0.6}/></div>
        <div style={cloudStyle(0.8, 60, '25%', -30)}><CloudSvg opacity={0.4}/></div>
        <div style={cloudStyle(1.5, 30, '5%', -5)}><CloudSvg opacity={0.8}/></div>
        <div style={cloudStyle(1.0, 50, '40%', -20)}><CloudSvg opacity={0.5}/></div>
      </>
    );
  } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
    colors = { top: '#455A64', bottom: '#263238' };
    elements = generateParticles(80, 'rain-drop');
  } else if (mainCondition.includes('snow')) {
    colors = { top: '#78909C', bottom: '#CFD8DC' };
    elements = generateParticles(50, 'snow-flake');
  } else if (mainCondition.includes('clear')) {
    colors = { top: '#1E88E5', bottom: '#64B5F6' };
    // Abstract sun
    elements = (
       <div style={{ position:'absolute', top: '15%', right: '15%', width: 120, height: 120, background: 'rgba(255, 235, 59, 0.9)', borderRadius: '50%', boxShadow: '0 0 80px rgba(255, 235, 59, 0.8)' }} />
    );
  } else if (mainCondition.includes('thunderstorm') || mainCondition.includes('storm')) {
    colors = { top: '#1b1b1b', bottom: '#0a0a0a' };
    elements = generateParticles(100, 'rain-drop');
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-gradient-top', colors.top);
    document.documentElement.style.setProperty('--bg-gradient-bottom', colors.bottom);
  }, [colors]);

  return (
    <div className="weather-background">
      {elements}
    </div>
  );
};

export default WeatherBackground;
