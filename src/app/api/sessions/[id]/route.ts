import { withAuth } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { getSessionById } from "@/lib/sessions/session.service";
import { SessionError } from "@/lib/sessions/session-error";
import { objectIdSchema } from "@/lib/validations/common.schema";

export const GET = withAuth(async (_request, session, context) => {
  try {
    const params = await context?.params;
    const id = objectIdSchema.parse(params?.id);
    const sessionDetail = await getSessionById(session.id, id);
    return success(sessionDetail);
  } catch (err) {
    if (err instanceof SessionError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
