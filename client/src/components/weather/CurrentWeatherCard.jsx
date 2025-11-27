import React from "react";
import Card from "../ui/Card";
import { FaTint, FaWind } from "react-icons/fa";
import { getWeatherIcon } from "../../utils/weatherHelpers";

const CurrentWeatherCard = ({ weatherData, city, t }) => {
  if (!weatherData) return null;

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="heading-tertiary text-gray-800">
          {t("WeatherPredictionPage.weather.forecast.current_title")}{" "}
          <span className="capitalize text-blue-600">{city}</span>
        </h2>
      </div>
      <Card
        padding="lg"
        className="max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left"
      >
        <div className="flex items-center gap-6 mb-6 sm:mb-0">
          {getWeatherIcon(weatherData.current.weather?.[0]?.description)}
          <div>
            <p className="text-5xl font-bold text-gray-800">
              {Math.round(weatherData.current.temp)}°C
            </p>
            <p className="text-body capitalize text-gray-600">
              {weatherData.current.weather?.[0]?.description}
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-gray-600">
          <div className="text-center">
            <FaTint className="mx-auto mb-1 text-blue-400" />{" "}
            {weatherData.current.humidity}%{" "}
            <span className="text-xs block">
              {t("WeatherPredictionPage.weather.forecast.humidity")}
            </span>
          </div>
          <div className="text-center">
            <FaWind className="mx-auto mb-1 text-gray-400" />{" "}
            {weatherData.current.wind_speed} m/s{" "}
            <span className="text-xs block">
              {t("WeatherPredictionPage.weather.forecast.wind")}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CurrentWeatherCard;
