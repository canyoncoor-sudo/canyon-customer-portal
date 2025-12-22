import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.PORTAL_JWT_SECRET || "your-secret-key-change-this"
);

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "canyon_admin_secret_2024_secure_key"
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

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Admin token verification failed:", error);
    return null;
  }
}
