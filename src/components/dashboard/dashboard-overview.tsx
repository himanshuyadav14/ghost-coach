"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  BarChart3,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { apiClient } from "@/lib/api/client";
import type { SessionSummary } from "@/types/coaching";
import { ProgressChart, ProgressChartSkeleton } from "@/components/dashboard/progress-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-20" />
      </CardContent>
    </Card>
  );
}

const quickActions = [
  {
    label: "Analyze Technique",
    href: "/dashboard/analysis",
    icon: Sparkles,
  },
  {
    label: "View Sessions",
    href: "/dashboard/sessions",
    icon: BarChart3,
  },
  {
    label: "Coach Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
];

export function DashboardOverview() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await apiClient.getSessions(1, 50);

    if (!response.success) {
      setError(response.error.message);
      toast.error(response.error.message);
      setIsLoading(false);
      return;
    }

    setSessions(response.data.items);
    setTotal(response.data.total);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        latestScore: "—",
        scoreChange: "—",
        scoreChangeSubtext: "Complete analyses to track progress",
      };
    }

    const sorted = [...sessions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latest = sorted[0].overallScore;
    const latestDate = sorted[0].createdAt;

    if (sorted.length < 2) {
      return {
        latestScore: latest,
        latestDate,
        scoreChange: "—",
        scoreChangeSubtext: "Need 2+ sessions for trend",
      };
    }

    const earliest = sorted[sorted.length - 1].overallScore;
    const delta = latest - earliest;
    const sign = delta > 0 ? "+" : "";

    return {
      latestScore: latest,
      latestDate,
      scoreChange: `${sign}${delta}`,
      scoreChangeSubtext:
        delta > 0
          ? "Improvement since first session"
          : delta < 0
            ? "Change since first session"
            : "No change since first session",
    };
  }, [sessions]);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchSessions}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-2",
            )}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Sessions"
              description="Completed technique analyses"
              value={total}
              subtext={
                total === 0 ? "Upload your first image" : `${sessions.length} loaded`
              }
            />
            <StatCard
              title="Latest Score"
              description="Most recent analysis result"
              value={stats.latestScore}
              subtext={
                sessions.length > 0
                  ? formatSessionDate(stats.latestDate)
                  : "No analyses yet"
              }
            />
            <StatCard
              title="Score Change"
              description="Progress since your first session"
              value={stats.scoreChange}
              subtext={stats.scoreChangeSubtext}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score Progression
          </CardTitle>
          <CardDescription>
            Track your batting technique scores over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ProgressChartSkeleton />
          ) : (
            <ProgressChart sessions={sessions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatSessionDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
