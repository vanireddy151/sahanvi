export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://sahanvi-2.onrender.com").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
