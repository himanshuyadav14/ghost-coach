import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

export function success<T>(
  data: T,
  status = 200,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(
  message: string,
  status = 400,
  code?: string,
  details?: unknown,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { message, code, details },
    },
    { status },
  );
}

export function notImplemented(
  message = "Not implemented",
): NextResponse<ApiErrorResponse> {
  return error(message, 501, "NOT_IMPLEMENTED");
}

export function unauthorized(
  message = "Unauthorized",
): NextResponse<ApiErrorResponse> {
  return error(message, 401, "UNAUTHORIZED");
}
