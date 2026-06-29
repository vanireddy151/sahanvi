import crypto from "crypto";

export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = process.env.AUTH_SECRET || "local-dev-secret";
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  const [body, signature] = token.split(".");
  const secret = process.env.AUTH_SECRET || "local-dev-secret";
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}
