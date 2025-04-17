import React, { useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import CurrentLocationWeather from './components/CurrentLocationWeather';
import './styles.css';

const App = () => {
  const [city, setCity] = useState('');
  const [searchWeather, setSearchWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    try {
      // Get coordinates from city name
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
      );

      if (geoRes.data.length === 0) {
        setError('City not found!');
        setSearchWeather(null);
        setLoading(false);
        return;
      }

      const { lat, lon, display_name } = geoRes.data[0];

      // Get weather from coordinates
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      const data = {
        name: display_name,
        temperature: weatherRes.data.current_weather.temperature,
        windspeed: weatherRes.data.current_weather.windspeed,
      };

      setSearchWeather(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong!');
      setSearchWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather Dashboard</h1>

      <form onSubmit={handleCitySearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {searchWeather && <WeatherCard weather={searchWeather} />}

      <CurrentLocationWeather />
    </div>
  );
};

export default App;
