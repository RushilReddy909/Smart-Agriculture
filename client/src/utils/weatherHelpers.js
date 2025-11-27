import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaCloudSun,
} from "react-icons/fa";

export const getWeatherIcon = (description) => {
  if (!description) return { icon: FaCloudSun, color: "text-gray-500" };
  const desc = description.toLowerCase();
  if (desc.includes("rain"))
    return { icon: FaCloudRain, color: "text-blue-500" };
  if (desc.includes("cloud")) return { icon: FaCloud, color: "text-gray-400" };
  if (desc.includes("snow"))
    return { icon: FaSnowflake, color: "text-blue-200" };
  if (desc.includes("clear")) return { icon: FaSun, color: "text-yellow-500" };
  return { icon: FaCloudSun, color: "text-gray-500" };
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
};
