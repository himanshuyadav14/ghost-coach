export interface ChatMessageDTO {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatThreadSummary {
  id: string;
  title?: string;
  sessionId?: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatThreadDetail {
  id: string;
  sessionId?: string;
  messages: ChatMessageDTO[];
}

export interface SendMessageResponse {
  threadId: string;
  reply: string;
  messages: ChatMessageDTO[];
}

export interface SendMessageInput {
  message: string;
  sessionId?: string;
  threadId?: string;
}

export interface ChatThreadsResponse {
  items: ChatThreadSummary[];
}
