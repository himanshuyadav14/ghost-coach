import { NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/api/handler";
import { clearAuthCookie } from "@/lib/auth/cookies";

export const POST = withErrorHandler(async () => {
  const response = NextResponse.json({
    success: true,
    data: { message: "Logged out successfully" },
  });
  return clearAuthCookie(response);
});
