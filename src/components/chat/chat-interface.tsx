"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api/client";
import type { ChatMessageDTO } from "@/types/chat";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { ChatInput } from "@/components/chat/chat-input";
import {
  ChatMessage,
  ChatTypingIndicator,
} from "@/components/chat/chat-message";
import { SessionSelector } from "@/components/chat/session-selector";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { ErrorState } from "@/components/shared/error-state";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get("sessionId");

  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadThreadForSession = useCallback(
    async (selectedSessionId: string | null) => {
      setIsInitializing(true);
      setInitError(null);
      setThreadId(null);
      setMessages([]);

      const threadsResponse = await apiClient.getChatThreads();
      if (!threadsResponse.success) {
        setInitError(threadsResponse.error.message);
        toast.error("Could not load chat history");
        setIsInitializing(false);
        return;
      }

      const matchingThread = threadsResponse.data.items.find((t) =>
        selectedSessionId ? t.sessionId === selectedSessionId : !t.sessionId,
      );

      if (matchingThread) {
        const threadResponse = await apiClient.getChatThread(matchingThread.id);
        if (!threadResponse.success) {
          setInitError(threadResponse.error.message);
          toast.error("Could not load chat history");
          setIsInitializing(false);
          return;
        }
        setThreadId(threadResponse.data.id);
        setMessages(threadResponse.data.messages);
      }

      setIsInitializing(false);
    },
    [],
  );

  useEffect(() => {
    loadThreadForSession(sessionId);
  }, [sessionId, loadThreadForSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSessionChange = (newSessionId: string | null) => {
    setSessionId(newSessionId);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setInput("");
      setIsLoading(true);

      const optimisticUser: ChatMessageDTO = {
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUser]);

      const response = await apiClient.sendChatMessage({
        message: trimmed,
        sessionId: sessionId ?? undefined,
        threadId: threadId ?? undefined,
      });

      if (!response.success) {
        toast.error(response.error.message);
        setMessages((prev) => prev.filter((m) => m !== optimisticUser));
        setInput(trimmed);
        setIsLoading(false);
        return;
      }

      setThreadId(response.data.threadId);
      setMessages(response.data.messages);
      setIsLoading(false);
    },
    [isLoading, sessionId, threadId],
  );

  const handleSend = () => sendMessage(input);

  if (isInitializing) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col rounded-xl border bg-card sm:min-h-[calc(100vh-8rem)]">
      <div className="flex shrink-0 flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div>
          <h2 className="font-semibold">Coach Chat</h2>
          <p className="text-sm text-muted-foreground">
            Your personal cricket batting coach
          </p>
        </div>
        <SessionSelector
          value={sessionId}
          onChange={handleSessionChange}
          disabled={isLoading}
          className="w-full sm:w-auto"
        />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-[300px] flex-col gap-4 px-3 py-4 sm:min-h-[400px] sm:px-4">
          {initError ? (
            <div className="flex flex-1 items-center justify-center py-8">
              <ErrorState
                message={initError}
                onRetry={() => loadThreadForSession(sessionId)}
                className="max-w-md border-none bg-transparent shadow-none"
              />
            </div>
          ) : messages.length === 0 && !isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-medium">Ask Ghost Coach anything</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Get personalized batting advice based on your profile
                  {sessionId ? " and selected session feedback" : ""}.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={`${message.createdAt}-${index}`}
                message={message}
              />
            ))
          )}
          {isLoading && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {messages.length === 0 && !initError && (
        <SuggestedPrompts onSelect={sendMessage} disabled={isLoading} />
      )}

      <div className="sticky bottom-0 shrink-0 border-t bg-card pb-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading || !!initError}
        />
      </div>
    </div>
  );
}
