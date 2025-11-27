import {
  fetchMandiPrices,
  parseMandiRecords,
  getMockMandiData,
} from "../utils/dataGovClient.js";
import { getCached, setCache } from "../utils/cacheHelper.js";

export const getMandiPrices = async (req, res) => {
  try {
    const { state, district, commodity, date } = req.query;

    const cacheKey = `mandi:${state}:${district}:${commodity}:${date}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const filters = {};
    if (state) filters.state = state;
    if (district) filters.district = district;
    if (commodity) filters.commodity = commodity;
    if (date) filters.arrival_date = date;

    let data,
      records,
      isMockData = false;

    try {
      data = await fetchMandiPrices(filters, { limit: 100 });
      records = parseMandiRecords(data.records || data.data || []);

      // If API returns no records, fallback to mock data
      if (records.length === 0) {
        console.log("⚠️ No records from API, using mock data");
        const mockData = getMockMandiData(filters);
        records = parseMandiRecords(mockData.records);
        isMockData = true;
      }
    } catch (apiError) {
      console.error(
        "❌ API Error, falling back to mock data:",
        apiError.message
      );
      const mockData = getMockMandiData(filters);
      records = parseMandiRecords(mockData.records);
      isMockData = true;
    }

    const response = {
      success: true,
      total: records.length,
      records,
      filters,
      isMockData,
      message: isMockData
        ? "Showing sample data. Live API data is currently unavailable."
        : undefined,
    };

    // Only cache for 1 hour if using mock data, 24 hours for real data
    await setCache(cacheKey, response, isMockData ? 3600 : 86400);

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching mandi prices:", error);
    res.status(503).json({
      success: false,
      error: "Data not available",
      message:
        "Unable to fetch mandi prices at this time. Please try again later.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const searchCommodities = async (req, res) => {
  try {
    const { query } = req.query;

    // Common commodities list (can be expanded)
    const commodities = [
      "Tomato",
      "Onion",
      "Potato",
      "Rice",
      "Wheat",
      "Maize",
      "Cotton",
      "Sugarcane",
      "Groundnut",
      "Soyabean",
      "Chilli",
      "Turmeric",
      "Coriander",
      "Garlic",
      "Ginger",
      "Brinjal",
      "Cabbage",
      "Cauliflower",
      "Carrot",
      "Beans",
    ];

    const filtered = query
      ? commodities.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
      : commodities;

    res.json({ commodities: filtered });
  } catch (error) {
    console.error("❌ Error searching commodities:", error);
    res.status(500).json({ error: "Failed to search commodities" });
  }
};

export const getStates = async (req, res) => {
  try {
    // Major agricultural states in India
    const states = [
      "Andhra Pradesh",
      "Bihar",
      "Chhattisgarh",
      "Gujarat",
      "Haryana",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Tamil Nadu",
      "Telangana",
      "Uttar Pradesh",
      "West Bengal",
    ];

    res.json({ states });
  } catch (error) {
    console.error("❌ Error fetching states:", error);
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

export const getPriceTrend = async (req, res) => {
  try {
    const { state, district, commodity, days = 7 } = req.query;

    if (!commodity) {
      return res.status(400).json({ error: "Commodity is required" });
    }

    const cacheKey = `trend:${state}:${district}:${commodity}:${days}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Fetch data for last N days
    const trend = [];
    const today = new Date();

    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      try {
        const filters = { commodity, arrival_date: dateStr };
        if (state) filters.state = state;
        if (district) filters.district = district;

        const data = await fetchMandiPrices(filters, { limit: 20 });
        const records = parseMandiRecords(data.records || []);

        if (records.length > 0) {
          const avgPrice =
            records.reduce((sum, r) => sum + r.modalPrice, 0) / records.length;
          trend.push({
            date: dateStr,
            avgPrice: parseFloat(avgPrice.toFixed(2)),
            records: records.length,
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch data for ${dateStr}:`, error.message);
      }
    }

    const response = { commodity, state, district, days, trend };
    await setCache(cacheKey, response, 3600); // 1 hour cache

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching price trend:", error);
    res.status(503).json({
      error: "Data not available",
      message:
        "Unable to fetch price trend at this time. Please try again later.",
    });
  }
};
