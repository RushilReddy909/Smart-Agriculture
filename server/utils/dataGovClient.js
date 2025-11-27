const DATA_GOV_BASE_URL = "https://api.data.gov.in/resource";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

export async function fetchMandiPrices(filters = {}, options = {}) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) throw new Error("DATA_GOV_API_KEY not configured");

  const { limit = 100, offset = 0 } = options;

  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: String(limit),
    offset: String(offset),
  });

  /*
    ✅ CORRECT FILTER KEYS for this resource
    (data.gov.in uses lowercase + .keyword sometimes)

    State        -> filters[state.keyword]
    District     -> filters[district]
    Market       -> filters[market]
    Commodity    -> filters[commodity]
    Variety      -> filters[variety]
    Arrival_Date -> filters[arrival_date]
  */

  if (filters.state) params.append("filters[state.keyword]", filters.state);
  if (filters.district) params.append("filters[district]", filters.district);
  if (filters.market) params.append("filters[market]", filters.market);
  if (filters.commodity) params.append("filters[commodity]", filters.commodity);
  if (filters.variety) params.append("filters[variety]", filters.variety);
  if (filters.arrival_date)
    params.append("filters[arrival_date]", filters.arrival_date);

  const url = `${DATA_GOV_BASE_URL}/${RESOURCE_ID}?${params.toString()}`;
  console.log("📡 Fetching mandi prices from data.gov.in");
  console.log("🔍 Filters:", filters);
  console.log("🌐 URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `data.gov.in API error: ${response.status} ${response.statusText} - ${text}`
    );
  }

  const data = await response.json();

  console.log(
    "✅ API Response - Total:",
    data.total,
    "Count:",
    data.count,
    "Records:",
    data.records?.length || 0
  );

  return {
    total: data.total || 0,
    count: data.count || (data.records?.length ?? 0),
    records: data.records || [],
  };
}

export function parseMandiRecords(records = []) {
  return records.map((r) => ({
    state: r.State || r.state || null,
    district: r.District || r.district || null,
    market: r.Market || r.market || null,
    commodity: r.Commodity || r.commodity || null,
    variety: r.Variety || r.variety || null,
    arrivalDate: r.Arrival_Date || r.arrival_date || null,

    minPrice: Number(r.Min_Price ?? r.min_price ?? r.minPrice ?? 0),
    maxPrice: Number(r.Max_Price ?? r.max_price ?? r.maxPrice ?? 0),
    modalPrice: Number(r.Modal_Price ?? r.modal_price ?? r.modalPrice ?? 0),
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
