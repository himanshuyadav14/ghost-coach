import { withAuth } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { getThread } from "@/lib/chat/chat.service";
import { ChatError } from "@/lib/chat/chat-error";
import { objectIdSchema } from "@/lib/validations/common.schema";

export const GET = withAuth(async (_request, session, context) => {
  try {
    const params = await context?.params;
    const threadId = objectIdSchema.parse(params?.threadId);
    const thread = await getThread(session.id, threadId);
    return success(thread);
  } catch (err) {
    if (err instanceof ChatError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
