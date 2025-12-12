// Normalization helpers for consistent cache keys and API filters
const normalizeString = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

export const normalizeLocationPart = (value = "") => normalizeString(value);

export const normalizeCommodity = (value = "") => normalizeString(value);

export const normalizeDate = (value = "") => value.toString().trim();

export const normalizeLatLon = (value = "") => value.toString().trim();

export const buildLocationKey = ({ lat, lon }) =>
  `lat:${normalizeLatLon(lat)}:lon:${normalizeLatLon(lon)}`;

export const buildMandiKey = ({ state, district, commodity, date }) => {
  const s = normalizeLocationPart(state || "");
  const d = normalizeLocationPart(district || "");
  const c = normalizeCommodity(commodity || "");
  const dt = normalizeDate(date || "");
  return `state:${s}|district:${d}|commodity:${c}|date:${dt}`;
};

export const buildTrendKey = ({ state, district, commodity, days }) => {
  const s = normalizeLocationPart(state || "");
  const d = normalizeLocationPart(district || "");
  const c = normalizeCommodity(commodity || "");
  const window = days?.toString().trim() || "";
  return `state:${s}|district:${d}|commodity:${c}|days:${window}`;
};
