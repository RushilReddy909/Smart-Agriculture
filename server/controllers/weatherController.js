import axios from "axios";

const fetchWeather = async (req, res) => {
  const { city } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    // 1️⃣ Fetch city forecast
    const forecastRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: { q: city, units: "metric", appid: API_KEY },
      }
    );

    const data = forecastRes.data;
    const list = data.list;

    // 2️⃣ Fetch current weather (to fill `weatherData.current`)
    const currentRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: { q: city, units: "metric", appid: API_KEY },
      }
    );

    const currentData = currentRes.data;

    // 3️⃣ Group by day (same logic as before)
    const dailyData = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push({
        temp: item.main.temp,
        humidity: item.main.humidity,
        weather: item.weather[0],
      });
    });

    const dailyForecast = Object.entries(dailyData).map(([date, values]) => {
      const temps = values.map((v) => v.temp);
      const humidities = values.map((v) => v.humidity);
      const mainWeather = values[Math.floor(values.length / 2)].weather;

      return {
        date,
        temp_min: Math.min(...temps),
        temp_max: Math.max(...temps),
        humidity_avg: +(
          humidities.reduce((a, b) => a + b, 0) / humidities.length
        ).toFixed(1),
        weather: mainWeather,
      };
    });

    // 4️⃣ Return combined data
    res.json({
      city: `${data.city.name}, ${data.city.country}`,
      current: {
        temp: currentData.main.temp,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
      },
      forecast: dailyForecast.slice(0, 5),
    });
  } catch (err) {
    console.error("Weather API Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: err.response?.data || err.message,
    });
  }
};

export { fetchWeather };
