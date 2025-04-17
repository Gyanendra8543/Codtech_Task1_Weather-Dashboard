import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';

const CurrentLocationWeather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCityName = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      return response.data.address.city || response.data.address.town || response.data.address.state || 'Your Location';
    } catch (err) {
      console.error('City name fetch error:', err);
      return 'Your Location';
    }
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      const cityName = await fetchCityName(lat, lon);

      const data = {
        name: cityName,
        temperature: weatherRes.data.current_weather.temperature,
        windspeed: weatherRes.data.current_weather.windspeed,
      };

      setWeather(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not fetch weather for your location!');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.error(error);
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="current-location-weather">
      <h2>🌎 Current Location Weather</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};

export default CurrentLocationWeather;
