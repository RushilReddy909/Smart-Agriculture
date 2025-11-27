import { api } from "../utils/axiosInstances";

export async function getWeatherForecast(lat, lon) {
  const response = await api.get(`/weather/forecast`, {
    params: { lat, lon },
  });
  return response.data;
}

export async function getFarmAdvisories(lat, lon) {
  const response = await api.get(`/weather/advisories`, {
    params: { lat, lon },
  });
  return response.data;
}

export async function getSprayWindows(lat, lon) {
  const response = await api.get(`/weather/spray-windows`, {
    params: { lat, lon },
  });
  return response.data;
}

export async function searchLocation(query) {
  const response = await api.get(`/weather/search`, {
    params: { query },
  });
  return response.data;
}

export function getWeatherIcon(code) {
  // OpenWeather icon codes: https://openweathermap.org/weather-conditions
  const iconMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "🌨️",
    "13n": "🌨️",
    "50d": "🌫️",
    "50n": "🌫️",
  };

  return iconMap[code] || "🌤️";
}

export function formatTemp(temp) {
  return `${Math.round(temp)}°C`;
}

export function formatWind(speed) {
  return `${Math.round(speed * 3.6)} km/h`;
}
