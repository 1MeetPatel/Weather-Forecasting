import React, { useMemo } from 'react';
import './WeatherBackground.css';

const generateParticles = (count, baseClass, variants) => {
  return Array.from({ length: count }).map((_, i) => {
    const variant = variants[Math.floor(Math.random() * variants.length)];
    return (
      <div
        key={i}
        className={`${baseClass} ${variant}`}
        style={{
          left: `${Math.random() * 120 - 10}%`,
          animationDuration: `${Math.random() * 1.5 + 0.8}s`,
          animationDelay: `-${Math.random() * 2}s`
        }}
      />
    );
  });
};

const generateStars = (count) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={`star-${i}`}
      className="star"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 60}%`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        animationDelay: `-${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`
      }}
    />
  ));
};

const ProceduralClouds = ({ isDark }) => (
  <div className="procedural-clouds-wrapper">
    <svg className="scrolling-clouds" width="200%" height="200%">
      <filter id={`cloud-noise-${isDark ? 'dark' : 'light'}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="4" seed="5" />
        <feColorMatrix type="matrix" values={`
          0 0 0 0 ${isDark ? 0.3 : 1}
          0 0 0 0 ${isDark ? 0.35 : 1}
          0 0 0 0 ${isDark ? 0.4 : 1}
          1 0 0 -0.2 0`} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#cloud-noise-${isDark ? 'dark' : 'light'})`} />
    </svg>
    <svg className="scrolling-clouds-layer2" width="200%" height="200%">
      <filter id={`cloud-noise-2-${isDark ? 'dark' : 'light'}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed="12" />
        <feColorMatrix type="matrix" values={`
          0 0 0 0 ${isDark ? 0.2 : 1}
          0 0 0 0 ${isDark ? 0.25 : 1}
          0 0 0 0 ${isDark ? 0.3 : 1}
          1 0 0 -0.4 0`} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#cloud-noise-2-${isDark ? 'dark' : 'light'})`} />
    </svg>
  </div>
);

const WeatherBackground = ({ condition, isDay = true }) => {
  const mainCondition = condition?.toLowerCase() || 'clear';

  let bgClass = 'bg-clear-day';
  if (mainCondition.includes('storm') || mainCondition.includes('thunder')) bgClass = 'bg-storm';
  else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) bgClass = isDay ? 'bg-rain-day' : 'bg-rain-night';
  else if (mainCondition.includes('snow')) bgClass = isDay ? 'bg-snow-day' : 'bg-snow-night';
  else if (mainCondition.includes('cloud') || mainCondition.includes('overcast') || mainCondition.includes('fog')) bgClass = isDay ? 'bg-clouds-day' : 'bg-clouds-night';
  else bgClass = isDay ? 'bg-clear-day' : 'bg-clear-night';

  const hasClouds = mainCondition.includes('cloud') || mainCondition.includes('overcast') || mainCondition.includes('fog') || mainCondition.includes('rain') || mainCondition.includes('snow') || mainCondition.includes('storm');
  const isDarkClouds = !isDay || mainCondition.includes('storm') || mainCondition.includes('rain');

  const elements = useMemo(() => {
    let els = [];

    // Lighting (Sun/Moon)
    if (!mainCondition.includes('cloud') && !mainCondition.includes('rain') && !mainCondition.includes('snow') && !mainCondition.includes('storm')) {
      if (isDay) els.push(<div key="sun" className="sun-glow" />);
      else {
        els.push(<div key="moon" className="moon-glow" />);
        els.push(...generateStars(50));
      }
    } else if (!isDay && !mainCondition.includes('storm') && !mainCondition.includes('rain')) {
      els.push(...generateStars(20)); // fewer stars peeking through light clouds
    }

    // Particles
    if (mainCondition.includes('rain') || mainCondition.includes('drizzle') || mainCondition.includes('storm')) {
      els.push(...generateParticles(120, 'apple-rain', ['rain-near', 'rain-mid', 'rain-far']));
    } else if (mainCondition.includes('snow')) {
      els.push(...generateParticles(150, 'apple-snow', ['snow-near', 'snow-mid', 'snow-far']));
    }

    // Lightning
    if (mainCondition.includes('storm') || mainCondition.includes('thunder')) {
      els.push(<div key="lightning" className="lightning-flash" />);
    }

    return els;
  }, [mainCondition, isDay]);

  return (
    <div className={`apple-weather-bg ${bgClass}`}>
      {hasClouds && <ProceduralClouds isDark={isDarkClouds} />}
      {elements}
    </div>
  );
};

export default WeatherBackground;
