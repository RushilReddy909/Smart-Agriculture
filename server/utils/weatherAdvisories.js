export function generateAdvisories(forecast) {
  const advisories = [];

  if (!forecast.hourly) {
    return advisories;
  }

  const hourly = forecast.hourly.slice(0, 24);
  const daily = forecast.daily || [];

  // Check rain in next 6 hours
  const rainNext6h = hourly.slice(0, 6).reduce((sum, h) => {
    return sum + (h.rain?.["3h"] || h.rain?.["1h"] || 0);
  }, 0);

  if (rainNext6h > 5) {
    advisories.push({
      title: "Heavy Rain Warning",
      description: `Heavy rain expected (${rainNext6h.toFixed(1)}mm in 6h)`,
      action: "Postpone spraying and fertilizer application",
      priority: "high",
    });
  }

  // Check wind speed - more lenient thresholds
  const maxWind = Math.max(...hourly.map((h) => h.wind_speed || 0));
  if (maxWind > 5.5) {
    // 5.5 m/s = 20 km/h
    advisories.push({
      title: "High Wind Alert",
      description: `Strong winds expected up to ${(maxWind * 3.6).toFixed(
        0
      )} km/h`,
      action: "Avoid spraying to prevent drift and secure loose objects",
      priority: "high",
    });
  } else if (maxWind > 3) {
    advisories.push({
      title: "Moderate Wind Conditions",
      description: `Wind speeds up to ${(maxWind * 3.6).toFixed(
        0
      )} km/h expected`,
      action: "Exercise caution when spraying, consider timing adjustments",
      priority: "low",
    });
  }

  // Temperature-based advisories
  if (daily.length > 0) {
    const maxTemp = Math.max(...daily.slice(0, 3).map((d) => d.temp?.max || 0));
    const minTemp = Math.min(...daily.slice(0, 3).map((d) => d.temp?.min || 0));

    if (maxTemp > 35) {
      advisories.push({
        title: "High Temperature Alert",
        description: `Temperatures reaching ${maxTemp.toFixed(0)}°C`,
        action: "Increase irrigation frequency and monitor crop stress",
        priority: "high",
      });
    } else if (maxTemp > 28) {
      advisories.push({
        title: "Warm Weather Conditions",
        description: `Temperatures up to ${maxTemp.toFixed(0)}°C expected`,
        action: "Ensure adequate water supply for crops and livestock",
        priority: "low",
      });
    }

    if (minTemp < 5) {
      advisories.push({
        title: "Frost Risk Alert",
        description: `Temperatures may drop to ${minTemp.toFixed(0)}°C`,
        action: "Cover sensitive plants and protect frost-vulnerable crops",
        priority: "high",
      });
    } else if (minTemp < 12) {
      advisories.push({
        title: "Cool Night Expected",
        description: `Night temperatures around ${minTemp.toFixed(0)}°C`,
        action: "Monitor cold-sensitive crops",
        priority: "low",
      });
    }

    // Dry spell check
    const rainNext5d = daily
      .slice(0, 5)
      .reduce((sum, d) => sum + (d.rain || 0), 0);
    if (rainNext5d < 2) {
      advisories.push({
        title: "Dry Spell Forecast",
        description: `Very little rain expected (${rainNext5d.toFixed(
          1
        )}mm in next 5 days)`,
        action: "Plan irrigation schedule and monitor soil moisture levels",
        priority: "medium",
      });
    }
  }

  // Humidity check
  const avgHumidity =
    hourly.reduce((sum, h) => sum + (h.humidity || 0), 0) / hourly.length;
  if (avgHumidity > 75) {
    advisories.push({
      title: "High Humidity Alert",
      description: `Average humidity around ${avgHumidity.toFixed(0)}%`,
      action:
        "Monitor for fungal diseases, ideal conditions for disease spread",
      priority: "medium",
    });
  }

  // Always provide at least one advisory
  if (advisories.length === 0) {
    advisories.push({
      title: "Favorable Farming Conditions",
      description:
        "Weather conditions are generally good for farming activities",
      action: "Good time for field work, planting, or maintenance tasks",
      priority: "low",
    });
  }

  return advisories;
}

export function findSprayWindows(hourly) {
  const windows = [];

  hourly.forEach((slot) => {
    const wind = slot.wind_speed || 99;
    const rain = (slot.rain?.["3h"] || slot.rain?.["1h"] || 0) > 0;
    const temp = slot.temp || 0;
    const humidity = slot.humidity || 0;
    const dt = slot.dt;

    if (!dt) return;

    const hour = new Date(dt * 1000).getHours();
    const isGoodTime = (hour >= 6 && hour <= 10) || (hour >= 17 && hour <= 20);

    // Ideal conditions
    const windOk = wind <= 4.2; // < 15 km/h
    const noRain = !rain;
    const tempOk = temp >= 15 && temp <= 32;
    const humidityOk = humidity >= 50 && humidity <= 85;

    if (windOk && noRain && tempOk && isGoodTime) {
      windows.push({
        dt: dt,
        temp: temp,
        wind_speed: wind,
        humidity: humidity,
      });
    }
  });

  return windows.slice(0, 8);
}
