import {
  fetchMandiPrices,
  parseMandiRecords,
  getMockMandiData,
} from "../utils/dataGovClient.js";
import { getCached, setCache } from "../utils/cacheHelper.js";
import {
  buildMandiKey,
  buildTrendKey,
  normalizeCommodity,
  normalizeDate,
  normalizeLocationPart,
} from "../utils/keyHelpers.js";

export const getMandiPrices = async (req, res) => {
  try {
    const { state, district, commodity, date } = req.query;

    const cacheKey = `mandi:${buildMandiKey({
      state,
      district,
      commodity,
      date,
    })}`;
    const cached = await getCached(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const filters = {};
    if (state) filters.state = state.trim();
    if (district) filters.district = district.trim();
    if (commodity) filters.commodity = commodity.trim();
    if (date) filters.arrival_date = date.trim();

    let records,
      isMockData = false,
      broaderSearch = false;

    try {
      const data = await fetchMandiPrices(filters, { limit: 100 });
      records = parseMandiRecords(data.records || []);

      // If no records with state+district, try with just state or just commodity
      if (records.length === 0 && district) {
        console.log("⚠️ No records with district filter, trying state only");
        const broaderFilters = { ...filters };
        delete broaderFilters.district;

        const broaderData = await fetchMandiPrices(broaderFilters, {
          limit: 100,
        });
        records = parseMandiRecords(broaderData.records || []);
        broaderSearch = records.length > 0;
      }

      // If still no records, try with just commodity
      if (records.length === 0 && (state || district)) {
        console.log(
          "⚠️ No records with location filters, trying commodity only"
        );
        const commodityOnly = {};
        if (commodity) commodityOnly.commodity = commodity;
        if (date) commodityOnly.arrival_date = date;

        if (Object.keys(commodityOnly).length > 0) {
          const commodityData = await fetchMandiPrices(commodityOnly, {
            limit: 100,
          });
          records = parseMandiRecords(commodityData.records || []);
          broaderSearch = records.length > 0;
        }
      }

      // If still no records, use mock data
      if (records.length === 0) {
        console.log("⚠️ No records from any API query, using mock data");
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
      broaderSearch,
      message: isMockData
        ? "Showing sample data. Live API data is currently unavailable."
        : broaderSearch
        ? "Showing results from a broader search area as no exact matches were found."
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

    const cacheKey = `trend:${buildTrendKey({
      state,
      district,
      commodity,
      days,
    })}`;
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
