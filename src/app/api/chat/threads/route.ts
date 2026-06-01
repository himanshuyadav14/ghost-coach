import { withAuth } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { listThreads } from "@/lib/chat/chat.service";

export const GET = withAuth(async (_request, session) => {
  const items = await listThreads(session.id);
  return success({ items });
});
