export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://sahanvi-2.onrender.com").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Some images (e.g. Cloudinary uploads) are already absolute URLs and
// must not be re-prefixed with the backend origin; others are legacy
// relative /uploads/... paths that still need it.
export function resolveImageUrl(path) {
  if (!path) return path;
  return /^https?:\/\//.test(path) ? path : apiUrl(path);
}
