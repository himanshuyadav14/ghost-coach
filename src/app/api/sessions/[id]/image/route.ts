import { NextResponse } from "next/server";

import { withAuth } from "@/lib/api/handler";
import { error } from "@/lib/api/response";
import { getSessionImage } from "@/lib/sessions/session.service";
import { SessionError } from "@/lib/sessions/session-error";
import { objectIdSchema } from "@/lib/validations/common.schema";

export const GET = withAuth(async (_request, session, context) => {
  try {
    const params = await context?.params;
    const id = objectIdSchema.parse(params?.id);
    const { buffer, mimeType } = await getSessionImage(session.id, id);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    if (err instanceof SessionError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
