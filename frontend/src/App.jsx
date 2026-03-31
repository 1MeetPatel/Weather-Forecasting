import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle } from 'lucide-react';
import WeatherBackground from './components/WeatherBackground';
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
      setCity(''); // Clear search bar
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
    if (main.includes('Cloud')) return '☁️';
    if (main.includes('Rain') || main.includes('Drizzle')) return '🌧️';
    if (main.includes('Snow')) return '❄️';
    if (main.includes('Thunderstorm') || main.includes('Storm')) return '⛈️';
    return '☀️';
  };

  return (
    <div className="weather-app-container">
      <WeatherBackground condition={weatherData?.weather[0]?.main || 'Clear'} />
      
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
              <h1>{weatherData.name}</h1>
              <div className="current-temperature">
                {Math.round(weatherData.main.temp)}°
              </div>
              <div className="current-condition">
                {weatherData.weather[0].main} &bull; {weatherData.weather[0].description}
              </div>
              <div className="high-low">
                H:{Math.round(weatherData.main.temp_max)}° &nbsp; L:{Math.round(weatherData.main.temp_min)}°
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
                         <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'}}>{getIcon(day.weather)}</span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
