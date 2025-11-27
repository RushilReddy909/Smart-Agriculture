import React from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaCloudSun,
} from "react-icons/fa";

export const getWeatherIcon = (description) => {
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

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
};
