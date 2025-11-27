import React, { useState } from "react";
import Container from "../components/layout/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import LocationSelector from "../components/ui/LocationSelector";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import CurrentWeatherCard from "../components/weather/CurrentWeatherCard";
import FarmAdvisoryCard from "../components/weather/FarmAdvisoryCard";
import SprayWindowCard from "../components/weather/SprayWindowCard";
import HourlyForecastCard from "../components/weather/HourlyForecastCard";
import DailyForecastGrid from "../components/weather/DailyForecastGrid";
import { FaCloudSun } from "react-icons/fa";
import { TbMapPinSearch } from "react-icons/tb";
import useLanguageStore from "../store/useLanguageStore";
import {
  getWeatherForecast,
  getFarmAdvisories,
  getSprayWindows,
  searchLocation,
} from "../services/weatherService";

const WeatherPrediction = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [advisories, setAdvisories] = useState(null);
  const [sprayWindows, setSprayWindows] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForecast, setShowForecast] = useState(false);
  const { t } = useLanguageStore();

  const handleFetchWeather = async (e) => {
    e.preventDefault();

    // Build search query from state, district, or city
    const searchQuery = district || state || city;
    if (!searchQuery) {
      setError("Please select a state/district or enter a city name.");
      return;
    }

    setIsLoading(true);
    setError("");
    setWeatherData(null);
    setAdvisories(null);
    setSprayWindows(null);
    setShowForecast(true);

    try {
      // Search for location coordinates using state/district or city
      const locationData = await searchLocation(searchQuery);
      console.log("Location response:", locationData);

      if (
        !locationData.success ||
        !locationData.data ||
        locationData.data.length === 0
      ) {
        setError("Location not found. Please try a different city.");
        setIsLoading(false);
        return;
      }

      const { lat, lon } = locationData.data[0];
      console.log("Coordinates:", lat, lon);
      // Fetch weather forecast, advisories, and spray windows
      const [forecastData, advisoryData, sprayData] = await Promise.all([
        getWeatherForecast(lat, lon),
        getFarmAdvisories(lat, lon),
        getSprayWindows(lat, lon),
      ]);

      console.log("Forecast response:", forecastData);
      console.log("Advisory response:", advisoryData);
      console.log("Spray windows response:", sprayData);

      setWeatherData(forecastData.data);
      setAdvisories(advisoryData.data);
      setSprayWindows(sprayData.data?.windows || []);
      setAdvisories(advisoryData.data);

      setTimeout(() => {
        document
          .getElementById("forecast-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Weather fetch error:", err);
      console.error("Error response:", err.response);

      if (err.response?.status === 401) {
        setError("Please log in to view weather data.");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to fetch weather data. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Input Section */}
        <div className="text-center mb-12 animate-fade-in max-w-3xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 p-4 rounded-2xl mb-4">
            <FaCloudSun size={40} />
          </div>
          <h1 className="heading-secondary text-gray-900 mb-4">
            {t("WeatherPredictionPage.weather.title")}
          </h1>
          <p className="text-body-large mb-8">
            {t("WeatherPredictionPage.weather.subtitle")}
          </p>
          <form
            onSubmit={handleFetchWeather}
            className="max-w-xl mx-auto space-y-4"
          >
            <LocationSelector
              state={state}
              district={district}
              onStateChange={(e) => setState(e.target.value)}
              onDistrictChange={(e) => setDistrict(e.target.value)}
              stateLabel="State"
              districtLabel="District"
              stateRequired={false}
              districtRequired={false}
              statePlaceholder="Select State (Optional)"
              districtPlaceholder="Select District (Optional)"
            />
            <div className="text-center text-gray-500 text-sm font-medium">
              OR
            </div>
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t(
                "WeatherPredictionPage.weather.form.city_placeholder"
              )}
              label="City Name"
            />
            <Button
              type="submit"
              size="input"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                t("WeatherPredictionPage.weather.form.submitting")
              ) : (
                <>
                  <TbMapPinSearch className="mr-2" />
                  {t("WeatherPredictionPage.weather.form.submit")}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Forecast Section */}
        {showForecast && (
          <div id="forecast-section" className="animate-fade-in">
            {isLoading && (
              <LoadingSpinner
                message={t("WeatherPredictionPage.weather.forecast.loading")}
                t={t}
              />
            )}

            {error && (
              <ErrorMessage
                message={t("WeatherPredictionPage.weather.error")}
                t={t}
              />
            )}

            {weatherData && (
              <>
                <CurrentWeatherCard
                  weatherData={weatherData}
                  city={city || district || state}
                  t={t}
                />

                <FarmAdvisoryCard advisories={advisories} t={t} />

                <SprayWindowCard sprayWindows={sprayWindows} t={t} />

                <HourlyForecastCard hourlyData={weatherData.hourly} t={t} />

                <DailyForecastGrid dailyData={weatherData.daily} t={t} />
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default WeatherPrediction;
