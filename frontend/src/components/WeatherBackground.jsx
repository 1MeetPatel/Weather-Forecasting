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

const generateGlassDroplets = () => {
  const droplets = [];
  
  // 1. Tiny Mist beads (highly dense, static, representing condensation)
  for (let i = 0; i < 45; i++) {
    const size = Math.random() * 2 + 1.5; // 1.5px - 3.5px
    droplets.push(
      <div
        key={`mist-${i}`}
        className="glass-droplet droplet-mist"
        style={{
          left: `${Math.random() * 96 + 2}%`,
          top: `${Math.random() * 96 + 2}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: Math.random() * 0.4 + 0.4
        }}
      />
    );
  }

  // 2. Standard static water beads (medium size, varying teardrop shapes)
  for (let i = 0; i < 25; i++) {
    const size = Math.random() * 4 + 4; // 4px - 8px
    const rotation = Math.random() * 40 - 20; // organic slight tilting
    droplets.push(
      <div
        key={`standard-${i}`}
        className="glass-droplet droplet-standard"
        style={{
          left: `${Math.random() * 96 + 2}%`,
          top: `${Math.random() * 92 + 4}%`,
          width: `${size}px`,
          height: `${size * 1.15}px`,
          transform: `rotate(${rotation}deg)`,
          opacity: Math.random() * 0.3 + 0.65
        }}
      />
    );
  }

  // 3. Heavy dripping droplets (larger, elongated, slowly winding down screen)
  for (let i = 0; i < 8; i++) {
    const size = Math.random() * 5 + 8; // 8px - 13px
    droplets.push(
      <div
        key={`dripper-${i}`}
        className="glass-droplet droplet-dripper"
        style={{
          left: `${Math.random() * 90 + 5}%`,
          top: `${Math.random() * 60 + 5}%`,
          width: `${size}px`,
          height: `${size * 1.4}px`,
          animationDelay: `-${Math.random() * 15}s`,
          animationDuration: `${Math.random() * 6 + 7}s`
        }}
      />
    );
  }

  return droplets;
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

  const isRain = mainCondition.includes('rain') || mainCondition.includes('drizzle');
  const isSnow = mainCondition.includes('snow');
  const isStorm = mainCondition.includes('storm') || mainCondition.includes('thunder');
  
  // "Partly cloudy" is a gorgeous hybrid: bright sun/moon, bright sky, but with drifting clouds.
  // "Overcast", "fog", "mist", "haze", "cloudy" (without "partly") are fully overcast.
  const isPartlyCloudy = mainCondition.includes('partly') && mainCondition.includes('cloud');
  const isFullyCloudy = (mainCondition.includes('cloud') || mainCondition.includes('overcast') || mainCondition.includes('fog') || mainCondition.includes('mist') || mainCondition.includes('haze')) && !isPartlyCloudy;
  const isClear = !isRain && !isSnow && !isStorm && !isFullyCloudy && !isPartlyCloudy;

  let bgClass = 'bg-clear-day';
  if (isStorm) bgClass = 'bg-storm';
  else if (isRain) bgClass = isDay ? 'bg-rain-day' : 'bg-rain-night';
  else if (isSnow) bgClass = isDay ? 'bg-snow-day' : 'bg-snow-night';
  else if (isFullyCloudy) bgClass = isDay ? 'bg-clouds-day' : 'bg-clouds-night';
  else bgClass = isDay ? 'bg-clear-day' : 'bg-clear-night'; // Clear, Mainly clear, and Partly cloudy all use bright sky

  const hasClouds = isFullyCloudy || isPartlyCloudy || isRain || isSnow || isStorm;
  const isDarkClouds = !isDay || isStorm || isRain;

  const elements = useMemo(() => {
    let els = [];

    // Lighting (Sun/Moon) - Rendered on Clear OR Partly Cloudy days
    if (isClear || isPartlyCloudy) {
      if (isDay) {
        els.push(<div key="sun" className="sun-glow" />);
      } else {
        els.push(...generateStars(50));
        els.push(<div key="moon" className="moon-glow" />);
      }
    } else if (!isDay && !isStorm && !isRain) {
      els.push(...generateStars(20)); // fewer stars peeking through light clouds
    }

    // Particles & Glass Droplets
    if (isRain || isStorm) {
      els.push(...generateParticles(120, 'apple-rain', ['rain-near', 'rain-mid', 'rain-far']));
      els.push(...generateGlassDroplets()); // spawn ultrarealistic 3D condensation and dripping raindrops
    } else if (isSnow) {
      els.push(...generateParticles(150, 'apple-snow', ['snow-near', 'snow-mid', 'snow-far']));
    }

    // Lightning
    if (isStorm) {
      els.push(<div key="lightning" className="lightning-flash" />);
    }

    return els;
  }, [mainCondition, isDay, isClear, isPartlyCloudy, isRain, isSnow, isStorm]);

  return (
    <div className={`apple-weather-bg ${bgClass}`}>
      {hasClouds && <ProceduralClouds isDark={isDarkClouds} />}
      {elements}
    </div>
  );
};

export default WeatherBackground;
