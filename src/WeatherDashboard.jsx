import { useState, useEffect, useRef } from 'react'

import './WeatherDashboard.css';

import { useNavigate } from 'react-router-dom';

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

export default function WeatherDashboard() {

  const isSelectingRef = useRef(false);

  const navigate = useNavigate();

  const [text, setText] = useState('');

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState([]);

  const [cityInfo, setCityInfo] = useState(null);

  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {

    if (isSelectingRef.current) {
      isSelectingRef.current = false; // reset the flag, skip this fetch
      return;
    }

    if (text.length === 0) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(() => {

      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.results || []);

        });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [text]);

  function handleChange(e) {
    setText(e.target.value);
    setSelectedCity(null); // user is typing fresh — no exact city picked yet
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWeather(null);

    if (selectedCity) {
      // skip geocoding entirely — already have exact coordinates
      fetchWeather(selectedCity);
    } else {
      // no suggestion was clicked — geocode whatever was typed
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.results || data.results.length === 0) {
            throw new Error('City not found. Try another search.');
          }
          fetchWeather(data.results[0]);
        })
        .catch((err) => {
          setError(err.message === 'City not found. Try another search.' ? err.message : 'Something went wrong. Please try again.');
          setLoading(false);
        });
    }
    setText('');
  }

  function fetchWeather(cityData) {

    setCityInfo(cityData);

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current_weather=true`)
      .then((response) => response.json())
      .then((weatherData) => {
        setWeather(weatherData);
        if (weatherData.current_weather.is_day === 0) {
          document.documentElement.classList.add('night-mode');
        } else {
          document.documentElement.classList.remove('night-mode');
        }
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="weather-container">
      <form className="weather-form" onSubmit={handleSubmit}>

        <div className="search-wrapper">
          <input value={text} onChange={handleChange} />
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    isSelectingRef.current = true;
                    setText(`${city.name}${city.admin1 ? `, ${city.admin1}` : ''}, ${city.country}`);
                    setSelectedCity(city); // store the whole object — exact lat/lon included
                    setSuggestions([]);
                  }}
                >
                  {city.name}{city.admin1 ? `, ${city.admin1}` : ''}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => navigate('/')}>Back</button>
      </form>
      {loading && <p className="weather-loading">Loading...</p>}

      {error && <p className="weather-error">{error}</p>}

      {weather && cityInfo && (
        <div className="weather-result">
          <p style={{ fontWeight: 'bold' }}>{cityInfo.name}{cityInfo.admin1 ? `, ${cityInfo.admin1}` : ''}, {cityInfo.country}</p>
          <p>Temperature: {weather.current_weather.temperature}°C</p>
          <p>Wind speed: {weather.current_weather.windspeed} km/h</p>
          <p>Wind direction: {weather.current_weather.winddirection}°</p>
          <p>{weather.current_weather.is_day === 1 ? 'Daytime' : 'Nighttime'}</p>
          <p>{getWeatherIcon(weather.current_weather.weathercode)}</p>
        </div>
      )}
    </div>
  );
}