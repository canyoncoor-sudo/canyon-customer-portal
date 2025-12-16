import { SignJWT } from 'jose';

export async function signPortalToken(jobId: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.PORTAL_JWT_SECRET);

  const token = await new SignJWT({ job_id: jobId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('canyon-portal')
    .setAudience('portal')
    .setSubject('customer')
    .setExpirationTime('2h')
    .sign(secret);

  return token;
}
