import React from "react";
import Card from "../ui/Card";
import { FaWind, FaTint } from "react-icons/fa";
import { getWeatherIcon } from "../../utils/weatherHelpers";

const HourlyForecastCard = ({ hourlyData, t }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <Card className="mb-8 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        24-Hour Forecast
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
          {hourlyData.slice(0, 8).map((hour, idx) => {
            const time = new Date(hour.dt * 1000);
            const timeStr = time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              hour12: true,
            });

            const { icon: WeatherIcon, color } = getWeatherIcon(
              hour.weather?.[0]?.description
            );

            return (
              <div
                key={idx}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow min-w-[120px]"
              >
                <span className="text-sm font-semibold text-gray-700">
                  {timeStr}
                </span>
                <div className="my-2">
                  <WeatherIcon className={color} size={32} />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {Math.round(hour.temp)}°C
                </span>
                <span className="text-xs text-gray-600 capitalize mt-1">
                  {hour.weather?.[0]?.main}
                </span>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <FaWind size={10} />
                  <span>{Math.round(hour.wind_speed * 3.6)} km/h</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <FaTint size={10} />
                  <span>{hour.humidity}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default HourlyForecastCard;
