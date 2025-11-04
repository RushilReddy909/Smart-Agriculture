import React, { useState } from "react";
import {api} from "../utils/axiosInstances"
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
  FaTint,
  FaCloudSun,
} from "react-icons/fa";
import { TbMapPinSearch } from "react-icons/tb";
import useLanguageStore from "../store/useLanguageStore";

// --- Helper Functions ---
const getWeatherIcon = (description) => {
  if (!description) return <FaCloudSun className="text-gray-500" size={48} />;
  const desc = description.toLowerCase();
  if (desc.includes("rain"))
    return <FaCloudRain className="text-blue-500" size={48} />;
  if (desc.includes("cloud"))
    return <FaCloud className="text-gray-400" size={48} />;
  if (desc.includes("snow"))
    return <FaSnowflake className="text-blue-200" size={48} />;
  if (desc.includes("clear"))
    return <FaSun className="text-yellow-500" size={48} />;
  return <FaCloudSun className="text-gray-500" size={48} />;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
};

const WeatherPrediction = () => {
  const [city, setCity] = useState("Indore");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForecast, setShowForecast] = useState(false);
  const { t } = useLanguageStore();

  const handleFetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    setIsLoading(true);
    setError("");
    setWeatherData(null);
    setShowForecast(true);

    try {
      const res = await api.get(
        `/weather?city=${encodeURIComponent(city)}`
      );
      setWeatherData(res.data);
      setTimeout(() => {
        document
          .getElementById("forecast-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch weather data.");
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
            className="max-w-xl mx-auto flex items-center gap-4"
          >
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("WeatherPredictionPage.weather.form.city_placeholder")}
              className="flex-grow"
            />
            <Button type="submit" size="input" disabled={isLoading || !city}>
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
              <div className="text-center text-gray-500 py-10">
                <svg
                  className="animate-spin h-8 w-8 mx-auto mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p>{t("WeatherPredictionPage.weather.forecast.loading")}</p>
              </div>
            )}

            {error && (
              <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">
                {t("WeatherPredictionPage.weather.error")}
              </p>
            )}

            {weatherData && (
              <>
                {/* Current Weather */}
                <div className="text-center mb-12">
                  <h2 className="heading-tertiary text-gray-800">
                    {t("WeatherPredictionPage.weather.forecast.current_title")} {" "}
                    <span className="capitalize text-blue-600">{city}</span>
                  </h2>
                </div>
                <Card
                  padding="lg"
                  className="max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left"
                >
                  <div className="flex items-center gap-6 mb-6 sm:mb-0">
                    {getWeatherIcon(weatherData.current.description)}
                    <div>
                      <p className="text-5xl font-bold text-gray-800">
                        {Math.round(weatherData.current.temp)}°C
                      </p>
                      <p className="text-body capitalize text-gray-600">
                        {weatherData.current.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-gray-600">
                    <div className="text-center">
                      <FaTint className="mx-auto mb-1 text-blue-400" />{" "}
                      {weatherData.current.humidity}%{" "}
                      <span className="text-xs block">{t("WeatherPredictionPage.weather.forecast.humidity")}</span>
                    </div>
                    <div className="text-center">
                      <FaWind className="mx-auto mb-1 text-gray-400" />{" "}
                      {weatherData.current.wind_speed} m/s{" "}
                      <span className="text-xs block">{t("WeatherPredictionPage.weather.forecast.wind")}</span>
                    </div>
                  </div>
                </Card>

                {/* 5-Day Forecast */}
                <h3 className="heading-tertiary text-center mb-6">
                  {t("WeatherPredictionPage.weather.forecast.forecast_title")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
                  {weatherData.forecast.slice(0, 5).map((day, index) => (
                    <Card key={index} padding="md" className="text-center">
                      <p className="font-bold text-gray-800">
                        {formatDate(
                          day.date ? new Date(day.date).getTime() / 1000 : 0
                        )}
                      </p>
                      <div className="my-3 mx-auto">
                        {getWeatherIcon(day.weather.description)}
                      </div>
                      <p className="text-body capitalize text-gray-600">
                        {day.weather.description}
                      </p>
                      <p className="font-semibold text-lg">
                        {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}
                        °
                      </p>
                      <p className="text-gray-500 text-sm">
                        Humidity: {day.humidity_avg}%
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
