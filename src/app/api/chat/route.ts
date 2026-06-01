import { NextRequest } from "next/server";

import { withAuth } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { sendMessage } from "@/lib/chat/chat.service";
import { ChatError } from "@/lib/chat/chat-error";
import { sendMessageSchema } from "@/lib/validations/chat.schema";

export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json();
    const data = sendMessageSchema.parse(body);
    const result = await sendMessage(session.id, data);
    return success(result);
  } catch (err) {
    if (err instanceof ChatError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
