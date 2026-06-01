"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";
import type { SessionSummary } from "@/types/coaching";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionSelectorProps {
  value: string | null;
  onChange: (sessionId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function SessionSelector({
  value,
  onChange,
  disabled = false,
  className,
}: SessionSelectorProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const response = await apiClient.getSessions(1, 50);
      if (response.success) {
        setSessions(response.data.items);
      }
      setIsLoading(false);
    }
    loadSessions();
  }, []);

  return (
    <Select
      value={value ?? "general"}
      onValueChange={(v) => onChange(v === "general" ? null : v)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={cn("w-full max-w-xs", className)}>
        <SelectValue placeholder="Select session context" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="general">General coaching</SelectItem>
        {sessions.map((session) => (
          <SelectItem key={session.id} value={session.id}>
            {formatDate(session.createdAt, {
              month: "short",
              day: "numeric",
            })}{" "}
            — Score {session.overallScore}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
