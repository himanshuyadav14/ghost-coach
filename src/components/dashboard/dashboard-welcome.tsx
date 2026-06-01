"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import type { ExperienceLevel } from "@/types/cricket";
import { Skeleton } from "@/components/ui/skeleton";

const skillLevelLabels: Record<ExperienceLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DashboardWelcome() {
  const { user, isLoading, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome, {user.name}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-muted-foreground">
          Your cricket batting coaching hub
        </p>
        {user.skillLevel && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
            {skillLevelLabels[user.skillLevel]}
          </span>
        )}
      </div>
    </div>
  );
}
