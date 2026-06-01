import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

import type { Timestamps } from "@/types/mongoose";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IChatThread extends Timestamps {
  userId: Types.ObjectId;
  sessionId?: Types.ObjectId;
  title?: string;
  messages: ChatMessage[];
}

export type ChatThreadDocument = IChatThread & Document;

const chatMessageSchema = new Schema<ChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const chatThreadSchema = new Schema<IChatThread>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "CoachingSession",
    },
    title: {
      type: String,
      trim: true,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

chatThreadSchema.index({ userId: 1, updatedAt: -1 });
chatThreadSchema.index({ userId: 1, sessionId: 1 });

export const ChatThread: Model<IChatThread> =
  models.ChatThread ?? model<IChatThread>("ChatThread", chatThreadSchema);
