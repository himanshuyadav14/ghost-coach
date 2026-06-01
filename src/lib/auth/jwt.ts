import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

import { env } from "@/config/env";
import type { JwtPayload } from "@/types/auth";

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
