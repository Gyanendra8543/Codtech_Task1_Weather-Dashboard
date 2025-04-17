import React from 'react';

const WeatherCard = ({ weather }) => {
  if (!weather) return <p>No weather data available.</p>;

  const { name = "Unknown", temperature = 0, windspeed = 0 } = weather;

  const getWeatherIcon = () => {
    if (temperature >= 30) return 'https://cdn-icons-png.flaticon.com/512/869/869869.png';
    if (temperature >= 20) return 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png';
    return 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
  };

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <img src={getWeatherIcon()} alt="weather icon" />
      <p>🌡️ Temperature: {temperature}°C</p>
      <p>🌬️ Wind Speed: {windspeed} km/h</p>
    </div>
  );
};

export default WeatherCard;
