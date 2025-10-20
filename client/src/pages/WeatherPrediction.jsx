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

const apiKey = process.env.WEATHER_API_KEY;

const WeatherPrediction = () => {
  const [city, setCity] = useState('Indore');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForecast, setShowForecast] = useState(false);

  const handleFetchWeather = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setWeatherData(null);
    setShowForecast(true);

    setTimeout(() => {
      document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // This simulates API call to fetch weather data.
    try {
      // Find closest matching city
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city
        )}&limit=1&appid=${apiKey}`
      );

      if (!geoRes.data || !geoRes.data.length)
        throw new Error("City not found");
      const { lat, lon, name, state, country } = geoRes.data[0];
      const approximateCity = `${name}${state ? ", " + state : ""}, ${country}`;

      // Fetch current weather
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const current = currentRes.data;

      // Fetch air pollution (AQI)
      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );

      const aqi = (aqiRes.data.list && aqiRes.data.list[0]?.main?.aqi) || null;

      // Fetch 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const forecastList = forecastRes.data?.list || [];
      const dailyMap = {};
      forecastList.forEach((f) => {
        const date = new Date(f.dt * 1000).toISOString().split("T")[0];
        if (!dailyMap[date])
          dailyMap[date] = {
            min: f.main.temp_min,
            max: f.main.temp_max,
            description: f.weather[0].description,
            humidity: f.main.humidity,
          };
        else {
          dailyMap[date].min = Math.min(dailyMap[date].min, f.main.temp_min);
          dailyMap[date].max = Math.max(dailyMap[date].max, f.main.temp_max);
          // average humidity
          dailyMap[date].humidity = Math.round(
            (dailyMap[date].humidity + f.main.humidity) / 2
          );
        }
      });

      const dailyArray = Object.keys(dailyMap)
        .slice(0, 5)
        .map((date) => ({
          dt: Math.floor(new Date(date).getTime() / 1000),
          temp: { min: dailyMap[date].min, max: dailyMap[date].max },
          weather: [{ description: dailyMap[date].description }],
          humidity: dailyMap[date].humidity,
        }));

      // Update state
      setWeatherData({
        approximateCity,
        current: {
          temp: current.main.temp,
          description: current.weather[0].description,
          humidity: current.main.humidity,
          wind_speed: current.wind.speed, // m/s
          icon: current.weather[0].icon,
        },
        aqi,
        daily: dailyArray,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch weather data."
      );
    } finally {
      setIsLoading(false);
    }
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
            Enter a city name to get a 5-day weather forecast, helping you plan critical farming activities like irrigation and harvesting.
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
                    {getWeatherIcon(weatherData.current.description)}
                    <div>
                      <p className="text-5xl font-bold text-gray-800">{Math.round(weatherData.current.temp)}°C</p>
                      <p className="text-body capitalize text-gray-600">{weatherData.current.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-gray-600">
                    <div className="text-center"><FaTint className="mx-auto mb-1 text-blue-400"/> {weatherData.current.humidity}% <span className="text-xs block">Humidity</span></div>
                    <div className="text-center"><FaWind className="mx-auto mb-1 text-gray-400"/> {weatherData.current.wind_speed} m/s <span className="text-xs block">Wind</span></div>
                    <div className="text-center">
                      <span className="text-xs block">AQI</span>
                      {weatherData.aqi}
                    </div>
                  </div>
                </Card>

                {/* 5-Day Forecast */}
                <h3 className="heading-tertiary text-center mb-6">Next 5 Days</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
                  {weatherData.daily.slice(0, 5).map((day, index) => (
                    <Card key={index} padding="md" className="text-center">
                      <p className="font-bold text-gray-800">{formatDate(day.dt)}</p>
                      <div className="my-3 mx-auto">
                        {getWeatherIcon(day.weather[0].description)}
                      </div>
                      <p className="text-body capitalize text-gray-600">
                        {day.weather[0].description}
                      </p>
                      <p className="font-semibold text-lg">
                        {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}
                        °
                      </p>
                      <p className="text-gray-500 text-sm">
                        Humidity: {day.humidity}%
                      </p>
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