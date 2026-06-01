import { NextRequest, NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import {
  AuthError,
  registerUser,
} from "@/lib/auth/auth.service";
import { setAuthCookie } from "@/lib/auth/cookies";
import { registerSchema } from "@/lib/validations/auth.schema";

export const POST = withErrorHandler(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);
    const { user, token } = await registerUser(data);

    const response = success({ user }, 201);
    return setAuthCookie(response as NextResponse, token);
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
