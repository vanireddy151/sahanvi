import { verifyToken } from "./token";

export const SESSION_COOKIE = "sahanvi-session";

export function getSessionUser(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifyToken(token);
}

export function requireAdmin(request) {
  const user = getSessionUser(request);
  if (!user || user.role !== "admin") return null;
  return user;
}
