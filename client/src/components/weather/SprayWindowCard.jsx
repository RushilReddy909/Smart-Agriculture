import React from "react";
import Card from "../ui/Card";

const SprayWindowCard = ({ sprayWindows, t }) => {
  if (!sprayWindows || sprayWindows.length === 0) return null;

  return (
    <Card className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-500 text-white p-2 rounded-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Best Spray Times (Next 48 Hours)
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Optimal conditions for pesticide/fertilizer application: Low wind, no
        rain, suitable temperature
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sprayWindows.slice(0, 6).map((window, idx) => {
          const timestamp = window.dt || window.time || window.timestamp;
          if (!timestamp) return null;

          const date = new Date(timestamp * 1000);
          const timeStr = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-green-700">
                  {timeStr}
                </span>
                <span className="text-xs text-gray-500">{dateStr}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold">
                    {window.temp ? Math.round(window.temp) : "N/A"}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind:</span>
                  <span className="font-semibold">
                    {window.wind_speed
                      ? Math.round(window.wind_speed * 3.6)
                      : "N/A"}{" "}
                    km/h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold">
                    {window.humidity || "N/A"}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conditions:</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                    IDEAL
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {sprayWindows.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          No ideal spray windows found in the next 48 hours. Check back later or
          consider indoor protection.
        </p>
      )}
    </Card>
  );
};

export default SprayWindowCard;
