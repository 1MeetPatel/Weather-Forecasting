import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, Droplets, CloudRain, Sun, Wind, Eye, Gauge } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import WeatherBackground from './components/WeatherBackground';
import MapWidget from './components/MapWidget';
import './index.css';

const getUVRangeLabel = (uv) => {
  if (uv <= 2) return 'Low danger';
  if (uv <= 5) return 'Moderate risk';
  if (uv <= 7) return 'High risk';
  if (uv <= 10) return 'Very high risk';
  return 'Extreme risk';
};

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const fetchWeather = async (searchCity) => {
    if (!searchCity) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`http://localhost:5000/weather/${searchCity}`),
        fetch(`http://localhost:5000/forecast/${searchCity}`)
      ]);
      
      if (!weatherRes.ok) throw new Error('City not found');
      
      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();
      
      setWeatherData(weather);
      setForecastData(forecast);
      setCity('');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather. Ensure the backend is running.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getIcon = (condition) => {
    const main = condition || 'Clear';
    if (main.includes('Cloud') || main.includes('Overcast') || main.includes('Fog')) return '☁️';
    if (main.includes('rain') || main.includes('Rain') || main.includes('Drizzle')) return '🌧️';
    if (main.includes('Snow') || main.includes('snow')) return '❄️';
    if (main.includes('Thunderstorm') || main.includes('Storm')) return '⛈️';
    return '☀️';
  };

  const today = forecastData?.forecast?.[0];

  return (
    <div className="weather-app-container">
      <WeatherBackground condition={weatherData?.weather_description || 'Clear'} isDay={weatherData?.is_day !== 0} />
      
      <div className="weather-ui-layer">
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Search for a city..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">
            <Search size={22} />
          </button>
        </form>

        {loading && <div className="loading">Detecting skies...</div>}
        {error && <div className="error-message" style={{display: 'flex', alignItems:'center', justifyContent: 'center', gap: 8}}><AlertCircle size={20} /> {error}</div>}

        {!loading && !error && !weatherData && (
          <div className="empty-state" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginTop: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <h2 style={{ fontWeight: 500, margin: 0 }}>Welcome to Weather Forecast</h2>
            <p style={{ opacity: 0.7, margin: 0 }}>Please search for a city or country to view the weather.</p>
          </div>
        )}

        {!loading && !error && weatherData && (
          <>
            <div className="current-weather">
              <h1>{weatherData.city}</h1>
              <div className="current-temperature">
                {Math.round(weatherData.temperature)}°
              </div>
              <div className="current-condition">
                {weatherData.weather_description}
              </div>
              <div className="high-low">
                H:{today ? Math.round(today.temp_max) : '--'}° &nbsp; L:{today ? Math.round(today.temp_min) : '--'}°
              </div>
            </div>

            <div className="weather-dashboard-grid">
              {/* Left Flank Panel: UV Index & Wind Speed */}
              <div className="flank-panel left-flank">
                <div className="stat-card glass-card uv-card">
                  <div className="stat-header">
                    <Sun size={16} className="text-yellow" />
                    <span>UV INDEX</span>
                  </div>
                  <div className="stat-value">{Math.round(weatherData.uv_index || 0)}</div>
                  <div className="stat-desc">{getUVRangeLabel(weatherData.uv_index || 0)}</div>
                  <div className="uv-scale-container">
                    <div className="uv-scale-bar" />
                    <div className="uv-scale-dot" style={{ left: `${Math.min(100, ((weatherData.uv_index || 0) / 12) * 100)}%` }} />
                  </div>
                </div>

                <div className="stat-card glass-card wind-card">
                  <div className="stat-header">
                    <Wind size={16} className="text-blue" />
                    <span>WIND</span>
                  </div>
                  <div className="stat-value-group">
                    <span className="stat-value">{Math.round(weatherData.wind_speed || 0)}</span>
                    <span className="stat-unit">km/h</span>
                  </div>
                  <div className="wind-compass-container">
                    <div className="wind-compass">
                      <div className="wind-arrow" style={{ transform: `rotate(${((weatherData.wind_speed || 0) * 15) % 360}deg)` }} />
                    </div>
                    <span className="wind-gust">Gusts up to {Math.round((weatherData.wind_speed || 0) * 1.25)} km/h</span>
                  </div>
                </div>
              </div>

              {/* Center Panel: 7-Day Forecast */}
              {forecastData && (
                <div className="forecast-glass center-panel">
                  <div className="forecast-header">
                    <Calendar size={16} /> 7-DAY FORECAST
                  </div>

                  <div className="forecast-list">
                    {forecastData.forecast && (() => {
                      const todayDate = forecastData.forecast[0]?.date;
                      const sortedForecast = [...forecastData.forecast].slice(0, 7).sort((a, b) => {
                        return new Date(a.date).getDay() - new Date(b.date).getDay();
                      });
                      return sortedForecast.map((day, idx) => {
                        const isDayToday = day.date === todayDate;
                        const dayName = isDayToday ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                        return (
                          <div key={idx} className="forecast-item">
                            <div className="forecast-day">
                              {dayName}
                            </div>
                            <div className="forecast-icon">
                              <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'}}>{getIcon(day.weather_condition)}</span>
                            </div>
                            <div className="forecast-temps">
                              <span className="low">{Math.round(day.temp_min)}°</span>
                              <div style={{ flex: 1, height: 6, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8))', borderRadius: 10, alignSelf: 'center'}} />
                              <span className="high">{Math.round(day.temp_max)}°</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {forecastData.prediction && (
                    <div className="prediction-message">
                      {forecastData.prediction}
                    </div>
                  )}
                </div>
              )}

              {/* Right Flank Panel: Visibility & Pressure */}
              <div className="flank-panel right-flank">
                <div className="stat-card glass-card visibility-card">
                  <div className="stat-header">
                    <Eye size={16} className="text-purple" />
                    <span>VISIBILITY</span>
                  </div>
                  <div className="stat-value-group">
                    <span className="stat-value">{Math.round((weatherData.visibility || 10000) / 1000)}</span>
                    <span className="stat-unit">km</span>
                  </div>
                  <div className="stat-desc">
                    {(weatherData.visibility || 10000) >= 10000 ? 'Perfect clarity.' : 'Light haze or mist.'}
                  </div>
                </div>

                <div className="stat-card glass-card pressure-card">
                  <div className="stat-header">
                    <Gauge size={16} className="text-teal" />
                    <span>PRESSURE</span>
                  </div>
                  <div className="stat-value-group">
                    <span className="stat-value">{Math.round(weatherData.pressure || 1013)}</span>
                    <span className="stat-unit">hPa</span>
                  </div>
                  <div className="pressure-gauge-container">
                    <div className="pressure-gauge-track" />
                    <div className="pressure-gauge-needle" style={{ transform: `rotate(${((Math.min(1030, Math.max(980, weatherData.pressure || 1013)) - 980) / 50) * 180 - 90}deg)` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Charts & Map */}
            {forecastData?.chart_data && (
              <div className="weather-bottom-row">
                <div className="charts-grid">
                  <div className="forecast-glass">
                    <div className="forecast-header">
                      <Droplets size={16} /> 24-HOUR HUMIDITY %
                    </div>
                    <div style={{ height: 160, width: '100%', marginTop: '10px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData.chart_data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11}} interval={3} />
                          <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11}} domain={[0, 100]} />
                          <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} itemStyle={{color: '#90CAF9'}} />
                          <Area type="monotone" dataKey="humidity" stroke="#90CAF9" fill="url(#colorUv)" fillOpacity={0.4} strokeWidth={2} />
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#90CAF9" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#90CAF9" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="forecast-glass">
                    <div className="forecast-header">
                      <CloudRain size={16} /> PRECIPITATION PROBABILITY %
                    </div>
                    <div style={{ height: 160, width: '100%', marginTop: '10px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={forecastData.chart_data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11}} interval={3} />
                          <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11}} domain={[0, 100]} />
                          <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} itemStyle={{color: '#E1BEE7'}} />
                          <Bar dataKey="precipitation" fill="#E1BEE7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="map-row" style={{ marginTop: '20px' }}>
                  <MapWidget city={weatherData.city} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
