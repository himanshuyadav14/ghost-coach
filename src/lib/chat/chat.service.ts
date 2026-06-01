import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { getUserProfile } from "@/lib/auth/auth.service";
import { generateCoachReply } from "@/lib/chat/coach-chat";
import { ChatError } from "@/lib/chat/chat-error";
import type { CoachContext } from "@/lib/chat/build-coach-context";
import { getSessionById } from "@/lib/sessions/session.service";
import { SessionError } from "@/lib/sessions/session-error";
import { ChatThread, type ChatMessage } from "@/models/chat-thread.model";
import { PlayerProfile } from "@/models/player-profile.model";
import { User } from "@/models/user.model";
import type {
  ChatMessageDTO,
  ChatThreadDetail,
  ChatThreadSummary,
  SendMessageInput,
  SendMessageResponse,
} from "@/types/chat";
import { formatDate } from "@/lib/utils";

function toMessageDTO(message: ChatMessage): ChatMessageDTO {
  return {
    role: message.role,
    content: message.content,
    createdAt:
      message.createdAt instanceof Date
        ? message.createdAt.toISOString()
        : new Date(message.createdAt).toISOString(),
  };
}

function truncateTitle(message: string, max = 60): string {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}...`;
}

async function loadCoachContext(
  userId: string,
  sessionId?: string,
): Promise<CoachContext> {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) {
    throw new ChatError("User not found", 404, "NOT_FOUND");
  }

  const profile = await PlayerProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();

  const skillLevel =
    profile?.skillLevel ?? (await getUserProfile(userId)) ?? "beginner";

  const context: CoachContext = {
    playerName: user.name,
    sport: profile?.sport ?? "cricket",
    role: profile?.role ?? "batsman",
    skillLevel,
    handedness: profile?.handedness,
    goals: profile?.goals?.map((g) => ({
      title: g.title,
      description: g.description,
    })),
  };

  if (sessionId) {
    try {
      const session = await getSessionById(userId, sessionId);
      context.session = {
        date: formatDate(session.createdAt, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        report: session.report,
      };
    } catch (err) {
      if (err instanceof SessionError) {
        throw new ChatError(err.message, err.status, err.code);
      }
      throw err;
    }
  }

  return context;
}

async function findOwnedThread(userId: string, threadId: string) {
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ChatError("Invalid thread ID", 422, "INVALID_ID");
  }

  await connectDB();

  const thread = await ChatThread.findOne({
    _id: threadId,
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!thread) {
    throw new ChatError("Thread not found", 404, "NOT_FOUND");
  }

  return thread;
}

export async function getOrCreateThread(
  userId: string,
  sessionId?: string,
) {
  await connectDB();

  const filter: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (sessionId) {
    filter.sessionId = new mongoose.Types.ObjectId(sessionId);
  } else {
    filter.sessionId = { $exists: false };
  }

  let thread = await ChatThread.findOne(filter);

  if (!thread) {
    thread = await ChatThread.create({
      userId,
      ...(sessionId ? { sessionId } : {}),
      messages: [],
    });
  }

  return thread;
}

export async function getThread(
  userId: string,
  threadId: string,
): Promise<ChatThreadDetail> {
  const thread = await findOwnedThread(userId, threadId);

  return {
    id: thread._id.toString(),
    sessionId: thread.sessionId?.toString(),
    messages: thread.messages.map(toMessageDTO),
  };
}

export async function listThreads(
  userId: string,
): Promise<ChatThreadSummary[]> {
  await connectDB();

  const threads = await ChatThread.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  return threads.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    sessionId: t.sessionId?.toString(),
    updatedAt: t.updatedAt.toISOString(),
    messageCount: t.messages.length,
  }));
}

export async function sendMessage(
  userId: string,
  input: SendMessageInput,
): Promise<SendMessageResponse> {
  let thread;

  if (input.threadId) {
    thread = await findOwnedThread(userId, input.threadId);
  } else {
    thread = await getOrCreateThread(userId, input.sessionId);
  }

  const sessionId =
    input.sessionId ?? thread.sessionId?.toString() ?? undefined;

  const context = await loadCoachContext(userId, sessionId);
  const priorMessages = [...thread.messages];

  const userMsg: ChatMessage = {
    role: "user",
    content: input.message.trim(),
    createdAt: new Date(),
  };

  thread.messages.push(userMsg);

  if (!thread.title) {
    thread.title = truncateTitle(input.message);
  }

  const reply = await generateCoachReply(
    context,
    priorMessages,
    userMsg.content,
  );

  const assistantMsg: ChatMessage = {
    role: "assistant",
    content: reply,
    createdAt: new Date(),
  };

  thread.messages.push(assistantMsg);
  await thread.save();

  return {
    threadId: thread._id.toString(),
    reply,
    messages: thread.messages.map(toMessageDTO),
  };
}

export async function getThreadForSession(
  userId: string,
  sessionId?: string,
): Promise<ChatThreadDetail | null> {
  await connectDB();

  const filter: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (sessionId) {
    filter.sessionId = new mongoose.Types.ObjectId(sessionId);
  } else {
    filter.sessionId = { $exists: false };
  }

  const thread = await ChatThread.findOne(filter).lean();

  if (!thread) {
    return null;
  }

  return {
    id: thread._id.toString(),
    sessionId: thread.sessionId?.toString(),
    messages: thread.messages.map(toMessageDTO),
  };
}
