import { jwtVerify } from 'jose';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.PORTAL_JWT_SECRET || 'admin-secret-key'
);

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload as { admin_id: string; email: string };
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return null;
  }
}
