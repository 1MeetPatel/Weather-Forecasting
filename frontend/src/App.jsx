import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, Droplets, CloudRain } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import WeatherBackground from './components/WeatherBackground';
import MapWidget from './components/MapWidget';
import './index.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default to a city so it's not empty on load
  useEffect(() => {
    fetchWeather('London');
  }, []);

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
      <WeatherBackground condition={weatherData?.weather_description || 'Clear'} />
      
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

            {forecastData && (
              <div className="forecast-glass">
                <div className="forecast-header">
                  <Calendar size={16} /> 5-DAY FORECAST
                </div>
                
                <div className="forecast-list">
                  {forecastData.forecast && forecastData.forecast.slice(0, 5).map((day, idx) => (
                    <div key={idx} className="forecast-item">
                      <div className="forecast-day">
                        {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="forecast-icon">
                         <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'}}>{getIcon(day.weather_condition)}</span>
                      </div>
                      <div className="forecast-temps">
                        <span className="low">{Math.round(day.temp_min)}°</span>
                        <div style={{ width: 100, height: 6, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8))', borderRadius: 10, alignSelf: 'center'}} />
                        <span className="high">{Math.round(day.temp_max)}°</span>
                      </div>
                    </div>
                  ))}
                </div>

                {forecastData.prediction && (
                  <div className="prediction-message">
                    ✨ {forecastData.prediction}
                  </div>
                )}
              </div>
            )}

            {/* Statistics Charts */}
            {forecastData?.chart_data && (
              <>
                <div className="forecast-glass" style={{ marginTop: '20px' }}>
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

                <div className="forecast-glass" style={{ marginTop: '20px' }}>
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

                <MapWidget city={weatherData.city} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
