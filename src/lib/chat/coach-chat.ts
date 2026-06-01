import type { ChatMessage } from "@/models/chat-thread.model";
import { getGeminiModel } from "@/lib/gemini/client";
import { ChatError } from "@/lib/chat/chat-error";
import {
  buildCoachSystemInstruction,
  type CoachContext,
} from "@/lib/chat/build-coach-context";

export async function generateCoachReply(
  context: CoachContext,
  priorMessages: ChatMessage[],
  userMessage: string,
): Promise<string> {
  try {
    const model = getGeminiModel();
    const history = priorMessages.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: {
        role: "user",
        parts: [{ text: buildCoachSystemInstruction(context) }],
      },
    });

    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    if (!text) {
      throw new ChatError(
        "No response received from the coach",
        502,
        "CHAT_FAILED",
      );
    }

    return text.trim();
  } catch (err) {
    if (err instanceof ChatError) {
      throw err;
    }

    console.error("[Gemini Chat Error]", err);
    throw new ChatError(
      "Coach is temporarily unavailable. Please try again.",
      502,
      "CHAT_FAILED",
    );
  }
}
