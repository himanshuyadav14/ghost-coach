import type { ExperienceLevel } from "@/types/cricket";

export type UserRole = "user" | "admin";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  skillLevel?: ExperienceLevel;
}

export interface AuthResponse {
  user: SessionUser;
}

export interface AuthTokens {
  accessToken: string;
}
