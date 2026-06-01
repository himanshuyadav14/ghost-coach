import { NextRequest, NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { AuthError, loginUser } from "@/lib/auth/auth.service";
import { setAuthCookie } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/validations/auth.schema";

export const POST = withErrorHandler(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);
    const { user, token } = await loginUser(data);

    const response = success({ user });
    return setAuthCookie(response as NextResponse, token);
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
