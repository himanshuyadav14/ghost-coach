import { NextRequest } from "next/server";

import { withAuth } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { listSessions } from "@/lib/sessions/session.service";
import { SessionError } from "@/lib/sessions/session-error";
import { paginationSchema } from "@/lib/validations/common.schema";

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = paginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const result = await listSessions(session.id, pagination);
    return success(result);
  } catch (err) {
    if (err instanceof SessionError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
