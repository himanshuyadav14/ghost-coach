import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const TOKEN_COOKIE_NAME = "ghost-coach-token";

const isProduction = process.env.NODE_ENV === "production";

export function getCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export async function setAuthCookie(
  response: NextResponse,
  token: string,
  maxAge = 60 * 60 * 24 * 7,
): Promise<NextResponse> {
  response.cookies.set(TOKEN_COOKIE_NAME, token, getCookieOptions(maxAge));
  return response;
}

export async function clearAuthCookie(
  response: NextResponse,
): Promise<NextResponse> {
  response.cookies.set(TOKEN_COOKIE_NAME, "", {
    ...getCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
