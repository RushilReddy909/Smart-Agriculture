import { api } from "../utils/axiosInstances";

export async function getMandiPrices(filters = {}) {
  const params = new URLSearchParams();

  if (filters.state) params.append("state", filters.state);
  if (filters.district) params.append("district", filters.district);
  if (filters.commodity) params.append("commodity", filters.commodity);
  if (filters.date) params.append("date", filters.date);

  const response = await api.get(`/price/mandi?${params.toString()}`);
  return response.data;
}

export async function searchCommodities(query = "") {
  const params = new URLSearchParams();
  if (query) params.append("query", query);

  const response = await api.get(`/price/commodities?${params.toString()}`);
  return response.data;
}

export async function getStates() {
  const response = await api.get("/price/states");
  return response.data;
}

export async function getPriceTrend(filters = {}, days = 7) {
  const params = new URLSearchParams({ days: days.toString() });

  if (filters.state) params.append("state", filters.state);
  if (filters.district) params.append("district", filters.district);
  if (filters.commodity) params.append("commodity", filters.commodity);

  const response = await api.get(`/price/trend?${params.toString()}`);
  return response.data;
}
