"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api/client";
import type { SessionDetail } from "@/types/coaching";
import { formatDate } from "@/lib/utils";
import { CoachingReportContent, getScoreBadgeStyles } from "@/components/analysis/coaching-report-content";
import { SessionModalSkeleton } from "@/components/sessions/session-modal-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionDetailsModalProps {
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailsModal({
  sessionId,
  open,
  onOpenChange,
}: SessionDetailsModalProps) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);
    setSession(null);

    const response = await apiClient.getSession(sessionId);

    if (!response.success) {
      setError(response.error.message);
      toast.error(response.error.message);
      setIsLoading(false);
      return;
    }

    setSession(response.data);
    setIsLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if (!open || !sessionId) {
      setSession(null);
      setError(null);
      return;
    }

    fetchSession();
  }, [open, sessionId, fetchSession]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto sm:max-w-3xl">
        {isLoading && <SessionModalSkeleton />}

        {!isLoading && error && (
          <ErrorState
            message={error}
            onRetry={fetchSession}
            className="border-none bg-transparent shadow-none"
          />
        )}

        {!isLoading && !error && session && (
          <>
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {formatDate(session.createdAt, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={session.imageUrl}
                alt="Batting session image"
                fill
                className="object-contain"
                unoptimized
              />
              <span
                className={cn(
                  "absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-bold shadow-sm",
                  getScoreBadgeStyles(session.overallScore),
                )}
              >
                {session.overallScore}
              </span>
            </div>

            <CoachingReportContent report={session.report} showScoreRing={false} />

            <div className="flex justify-end pt-2">
              <Link
                href={`/dashboard/chat?sessionId=${session.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <MessageSquare className="h-4 w-4" />
                Chat with coach
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
