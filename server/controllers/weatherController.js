import axios from "axios";
import {
  generateAdvisories,
  findSprayWindows,
} from "../utils/weatherAdvisories.js";
import { getCached, setCache } from "../utils/cacheHelper.js";

export const getWeatherForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const cacheKey = `weather:${lat}:${lon}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Use free APIs: Current Weather + 5-day Forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: { lat, lon, units: "metric", appid: API_KEY },
      }),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: { lat, lon, units: "metric", appid: API_KEY },
      }),
    ]);

    const current = currentResponse.data;
    const forecast = forecastResponse.data;

    // Group forecast by day
    const dailyMap = new Map();
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date).push(item);
    });

    // Calculate daily min/max/avg
    const daily = Array.from(dailyMap.entries())
      .slice(0, 5)
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const humidities = items.map((i) => i.main.humidity);
        const winds = items.map((i) => i.wind.speed);

        return {
          dt: items[0].dt,
          temp: {
            min: Math.min(...temps),
            max: Math.max(...temps),
          },
          humidity: Math.round(
            humidities.reduce((a, b) => a + b, 0) / humidities.length
          ),
          wind_speed:
            Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 10) /
            10,
          weather: [items[0].weather[0]],
          rain: items.some((i) => i.rain)
            ? { "3h": items.reduce((sum, i) => sum + (i.rain?.["3h"] || 0), 0) }
            : undefined,
        };
      });

    const weatherData = {
      lat: current.coord.lat,
      lon: current.coord.lon,
      timezone: current.timezone,
      current: {
        dt: current.dt,
        temp: current.main.temp,
        feels_like: current.main.feels_like,
        humidity: current.main.humidity,
        wind_speed: current.wind.speed,
        weather: [current.weather[0]],
        uvi: 0, // Not available in free tier
        visibility: current.visibility,
      },
      hourly: forecast.list.slice(0, 24).map((h) => ({
        dt: h.dt,
        temp: h.main.temp,
        humidity: h.main.humidity,
        wind_speed: h.wind.speed,
        rain: h.rain,
        weather: [h.weather[0]],
      })),
      daily: daily,
      alerts: [],
    };

    const response_data = { success: true, data: weatherData };
    await setCache(cacheKey, response_data, 3600); // 1 hour cache
    res.json(response_data);
  } catch (error) {
    console.error(
      "❌ Weather API Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch weather data",
      message: error.response?.data?.message || error.message,
    });
  }
};

export const getFarmAdvisories = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const cacheKey = `advisories:${lat}:${lon}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Fetch weather forecast using free API
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: { lat, lon, units: "metric", appid: API_KEY },
      }
    );

    // Convert free API format to match One Call structure for generateAdvisories
    const mockOneCallData = {
      current: forecastResponse.data.list[0]
        ? {
            temp: forecastResponse.data.list[0].main.temp,
            humidity: forecastResponse.data.list[0].main.humidity,
            wind_speed: forecastResponse.data.list[0].wind.speed,
            weather: [forecastResponse.data.list[0].weather[0]],
          }
        : {},
      hourly: forecastResponse.data.list.slice(0, 24).map((h) => ({
        dt: h.dt,
        temp: h.main.temp,
        humidity: h.main.humidity,
        wind_speed: h.wind.speed,
        weather: [h.weather[0]],
        rain: h.rain,
      })),
      daily: [],
    };

    const advisories = generateAdvisories(mockOneCallData);

    const response_data = { success: true, data: advisories };
    await setCache(cacheKey, response_data, 3600); // 1 hour cache
    res.json(response_data);
  } catch (error) {
    console.error("❌ Error generating advisories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate farm advisories",
      message: error.response?.data?.message || error.message,
    });
  }
};

export const getSprayWindows = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const cacheKey = `spray:${lat}:${lon}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Fetch weather forecast using free API
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: { lat, lon, units: "metric", appid: API_KEY },
      }
    );

    const hourly = forecastResponse.data.list.map((h) => ({
      dt: h.dt,
      temp: h.main.temp,
      humidity: h.main.humidity,
      wind_speed: h.wind.speed,
      weather: [h.weather[0]],
      rain: h.rain,
    }));

    const windows = findSprayWindows(hourly);

    const response_data = { success: true, data: { windows } };
    await setCache(cacheKey, response_data, 3600); // 1 hour cache
    res.json(response_data);
  } catch (error) {
    console.error("❌ Error finding spray windows:", error);
    res.status(500).json({
      success: false,
      error: "Failed to find spray windows",
      message: error.response?.data?.message || error.message,
    });
  }
};

export const searchLocation = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct`;

    const response = await axios.get(url, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    const locations = response.data.map((loc) => ({
      name: loc.name,
      state: loc.state,
      country: loc.country,
      lat: loc.lat,
      lon: loc.lon,
    }));

    res.json({ success: true, data: locations });
  } catch (error) {
    console.error("❌ Error searching location:", error);
    res.status(500).json({ error: "Failed to search location" });
  }
};
