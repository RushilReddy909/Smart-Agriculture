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
