import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.PORTAL_JWT_SECRET || "your-secret-key-change-this"
);

export async function verifyPortalToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
