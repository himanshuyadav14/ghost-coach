import { getTokenFromCookies } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";
import type { SessionUser } from "@/types/auth";

export async function getSession(): Promise<SessionUser | null> {
  const token = await getTokenFromCookies();

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}
