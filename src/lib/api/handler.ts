import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getTokenFromCookies } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";
import { error } from "@/lib/api/response";
import type { SessionUser } from "@/types/auth";

type RouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

type AuthenticatedHandler = (
  request: NextRequest,
  session: SessionUser,
  context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      if (err instanceof ZodError) {
        return error("Validation failed", 422, "VALIDATION_ERROR", err.issues);
      }

      console.error("[API Error]", err);
      return error("Internal server error", 500, "INTERNAL_ERROR");
    }
  };
}

export function withAuth(handler: AuthenticatedHandler): RouteHandler {
  return withErrorHandler(async (request, context) => {
    const token = await getTokenFromCookies();

    if (!token) {
      return error("Unauthorized", 401, "UNAUTHORIZED");
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return error("Invalid or expired token", 401, "UNAUTHORIZED");
    }

    const session: SessionUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    return handler(request, session, context);
  });
}
