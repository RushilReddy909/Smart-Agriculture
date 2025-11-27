const DATA_GOV_BASE_URL = "https://api.data.gov.in/resource";

// Use working resource ID
const RESOURCE_ID = "35985678-0d79-46b4-9ed6-6f13308a1d24";

export async function fetchMandiPrices(filters = {}, options = {}) {
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!apiKey) {
    throw new Error("DATA_GOV_API_KEY not configured");
  }

  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: String(options.limit || 50),
    offset: String(options.offset || 0),
  });

  // Add filters - API requires Title Case field names
  if (filters.state) params.append("filters[State]", filters.state);
  if (filters.district) params.append("filters[District]", filters.district);
  if (filters.market) params.append("filters[Market]", filters.market);
  if (filters.commodity) params.append("filters[Commodity]", filters.commodity);
  if (filters.arrival_date)
    params.append("filters[Arrival_Date]", filters.arrival_date);

  const url = `${DATA_GOV_BASE_URL}/${RESOURCE_ID}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `data.gov.in API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

export function parseMandiRecords(records) {
  return records.map((record) => ({
    state: record.State || record.state,
    district: record.District || record.district,
    market: record.Market || record.market,
    commodity: record.Commodity || record.commodity,
    variety: record.Variety || record.variety,
    arrivalDate: record.Arrival_Date || record.arrival_date || record.date,
    minPrice:
      parseFloat(record.Min_Price || record.min_price || record.minPrice) || 0,
    maxPrice:
      parseFloat(record.Max_Price || record.max_price || record.maxPrice) || 0,
    modalPrice:
      parseFloat(
        record.Modal_Price || record.modal_price || record.modalPrice
      ) || 0,
  }));
}

// Mock data for development/testing when API is unavailable
export function getMockMandiData(filters = {}) {
  const today = new Date().toISOString().split("T")[0];

  const mockData = [
    {
      state: "Karnataka",
      district: "Bangalore",
      market: "Bangalore (Yeshwanthpur)",
      commodity: "Tomato",
      variety: "Local",
      arrival_date: today,
      min_price: "18",
      max_price: "35",
      modal_price: "25",
    },
    {
      state: "Karnataka",
      district: "Bangalore",
      market: "Bangalore (KR Market)",
      commodity: "Tomato",
      variety: "Hybrid",
      arrival_date: today,
      min_price: "20",
      max_price: "38",
      modal_price: "28",
    },
    {
      state: "Karnataka",
      district: "Mysore",
      market: "Mysore (Bandipalya)",
      commodity: "Tomato",
      variety: "Local",
      arrival_date: today,
      min_price: "15",
      max_price: "30",
      modal_price: "22",
    },
    {
      state: "Maharashtra",
      district: "Pune",
      market: "Pune (Market Yard)",
      commodity: "Onion",
      variety: "Red",
      arrival_date: today,
      min_price: "25",
      max_price: "45",
      modal_price: "35",
    },
    {
      state: "Punjab",
      district: "Ludhiana",
      market: "Ludhiana",
      commodity: "Wheat",
      variety: "PBW 725",
      arrival_date: today,
      min_price: "2200",
      max_price: "2400",
      modal_price: "2300",
    },
  ];

  // Filter mock data based on query
  let filtered = mockData;

  if (filters.state) {
    filtered = filtered.filter((r) =>
      r.state.toLowerCase().includes(filters.state.toLowerCase())
    );
  }
  if (filters.district) {
    filtered = filtered.filter((r) =>
      r.district.toLowerCase().includes(filters.district.toLowerCase())
    );
  }
  if (filters.commodity) {
    filtered = filtered.filter((r) =>
      r.commodity.toLowerCase().includes(filters.commodity.toLowerCase())
    );
  }

  return {
    records: filtered,
    total: filtered.length,
    mock: true,
  };
}
