import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_COOKIE_NAME } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token);
    isAuthenticated = payload !== null;
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
