import React, { useState } from 'react';
import axios from 'axios';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaWind, FaTint, FaCloudSun } from 'react-icons/fa';
import { TbMapPinSearch } from 'react-icons/tb';

// --- Helper Functions ---

const getWeatherIcon = (description) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain')) return <FaCloudRain className="text-blue-500" size={48} />;
  if (desc.includes('cloud')) return <FaCloud className="text-gray-400" size={48} />;
  if (desc.includes('snow')) return <FaSnowflake className="text-blue-200" size={48} />;
  if (desc.includes('clear')) return <FaSun className="text-yellow-500" size={48} />;
  return <FaCloudSun className="text-gray-500" size={48} />;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

const WeatherPrediction = () => {
  const [city, setCity] = useState('Indore');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForecast, setShowForecast] = useState(false);

  const handleFetchWeather = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setWeatherData(null);
    setShowForecast(true);

    setTimeout(() => {
      document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // --- MOCK API CALL ---
    // This simulates an API call. Replace this with a real API call to a weather service.
    setTimeout(() => {
      if (city.toLowerCase() === 'error') {
        setError('City not found. Please try another location.');
      } else {
        setWeatherData({
          current: { dt: 1665147600, temp: 25, weather: [{ description: 'clear sky' }], humidity: 60, wind_speed: 5 },
          daily: Array(7).fill({ dt: 1665147600, temp: { max: 28, min: 18 }, weather: [{ description: 'haze' }] })
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Initial Prompt Section */}
        <div className="text-center mb-12 animate-fade-in max-w-3xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 p-4 rounded-2xl mb-4">
            <FaCloudSun size={40} />
          </div>
          <h1 className="heading-secondary text-gray-900 mb-4">
            Localized Weather Forecast
          </h1>
          <p className="text-body-large mb-8">
            Enter a city name to get a 7-day weather forecast, helping you plan critical farming activities like irrigation and harvesting.
          </p>
          <form onSubmit={handleFetchWeather} className="max-w-xl mx-auto flex items-center gap-4">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., Indore)"
              className="flex-grow"
            />
            {/* The button size is now adjusted to match the input field height */}
            <Button type="submit" size="input" disabled={isLoading || !city}>
              {isLoading ? 'Fetching...' : <><TbMapPinSearch className="mr-2"/>Get Forecast</>}
            </Button>
          </form>
        </div>

        {/* Forecast Section (conditionally rendered) */}
        {showForecast && (
          <div id="forecast-section" className="animate-fade-in">
            {isLoading && (
              <div className="text-center text-gray-500 py-10">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p>Fetching the latest weather data...</p>
              </div>
            )}

            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">{error}</p>}

            {weatherData && (
              <>
                <div className="text-center mb-12">
                  <h2 className="heading-tertiary text-gray-800">
                    Weather Forecast for <span className="capitalize text-blue-600">{city}</span>
                  </h2>
                </div>
                {/* Current Weather Card */}
                <Card padding="lg" className="max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                  <div className="flex items-center gap-6 mb-6 sm:mb-0">
                    {getWeatherIcon(weatherData.current.weather[0].description)}
                    <div>
                      <p className="text-5xl font-bold text-gray-800">{Math.round(weatherData.current.temp)}°C</p>
                      <p className="text-body capitalize text-gray-600">{weatherData.current.weather[0].description}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-gray-600">
                    <div className="text-center"><FaTint className="mx-auto mb-1 text-blue-400"/> {weatherData.current.humidity}% <span className="text-xs block">Humidity</span></div>
                    <div className="text-center"><FaWind className="mx-auto mb-1 text-gray-400"/> {weatherData.current.wind_speed} m/s <span className="text-xs block">Wind</span></div>
                  </div>
                </Card>

                {/* 7-Day Forecast */}
                <h3 className="heading-tertiary text-center mb-6">Next 7 Days</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {weatherData.daily.slice(0, 7).map((day, index) => (
                    <Card key={index} padding="md" className="text-center">
                      <p className="font-bold text-gray-800">{formatDate(day.dt)}</p>
                      <div className="my-3 mx-auto">
                        {getWeatherIcon(day.weather[0].description)}
                      </div>
                      <p className="font-semibold text-lg">{Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°</p>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default WeatherPrediction;