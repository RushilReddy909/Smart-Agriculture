import React from "react";
import Card from "../ui/Card";
import { getWeatherIcon } from "../../utils/weatherHelpers";
import { formatDate } from "../../utils/weatherHelpers";

const DailyForecastGrid = ({ dailyData, t }) => {
  if (!dailyData || dailyData.length === 0) return null;

  return (
    <>
      <h3 className="heading-tertiary text-center mb-6">
        {t("WeatherPredictionPage.weather.forecast.forecast_title")}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {dailyData.slice(0, 5).map((day, index) => {
          const { icon: WeatherIcon, color } = getWeatherIcon(
            day.weather?.[0]?.description
          );
          return (
            <Card key={index} padding="md" className="text-center">
              <p className="font-bold text-gray-800">{formatDate(day.dt)}</p>
              <div className="my-3 mx-auto">
                <WeatherIcon className={color} size={48} />
              </div>
              <p className="text-body capitalize text-gray-600">
                {day.weather?.[0]?.description}
              </p>
              <p className="font-semibold text-lg">
                {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
              </p>
              <p className="text-gray-500 text-sm">Humidity: {day.humidity}%</p>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default DailyForecastGrid;
