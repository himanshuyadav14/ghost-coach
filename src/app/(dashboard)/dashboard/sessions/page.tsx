"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BarChart3 } from "lucide-react";

import { apiClient } from "@/lib/api/client";
import type { SessionSummary } from "@/types/coaching";
import { SessionCard } from "@/components/sessions/session-card";
import { SessionCardSkeleton } from "@/components/sessions/session-card-skeleton";
import { SessionDetailsModal } from "@/components/sessions/session-details-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSessions = useCallback(async (isRetry = false) => {
    setIsLoading(true);
    setError(null);
    const response = await apiClient.getSessions();

    if (!response.success) {
      setError(response.error.message);
      toast.error(response.error.message);
      setIsLoading(false);
      return;
    }

    setSessions(response.data.items);
    setIsLoading(false);

    if (isRetry) {
      toast.success("Sessions refreshed");
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Session History
        </h1>
        <p className="text-muted-foreground">
          Review your past batting analyses and coaching feedback
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => fetchSessions(true)} />
      )}

      {!isLoading && !error && sessions.length === 0 && (
        <EmptyState
          icon={BarChart3}
          title="No sessions yet"
          description="Upload a batting image to get your first AI coaching analysis"
          action={{ label: "Start Analysis", href: "/dashboard/analysis" }}
        />
      )}

      {!isLoading && !error && sessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => handleSessionClick(session.id)}
            />
          ))}
        </div>
      )}

      <SessionDetailsModal
        sessionId={selectedSessionId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
