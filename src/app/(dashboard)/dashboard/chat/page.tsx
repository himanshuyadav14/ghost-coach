"use client";

import { Suspense } from "react";

import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";

export default function ChatPage() {
  return (
    <div className="mx-auto w-full space-y-4 sm:max-w-4xl">
      <Suspense fallback={<ChatSkeleton />}>
        <ChatInterface />
      </Suspense>
    </div>
  );
}
