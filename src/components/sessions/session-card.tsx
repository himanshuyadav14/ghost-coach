"use client";

import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";

import type { SessionSummary } from "@/types/coaching";
import { formatDate } from "@/lib/utils";
import { getScoreBadgeStyles } from "@/components/analysis/coaching-report-content";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface SessionCardProps {
  session: SessionSummary;
  onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={session.imageUrl}
          alt="Batting session thumbnail"
          fill
          className="object-cover"
          unoptimized
        />
        <span
          className={cn(
            "absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-bold",
            getScoreBadgeStyles(session.overallScore),
          )}
        >
          {session.overallScore}
        </span>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(session.createdAt, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Priority fix: </span>
          {session.priorityFix}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </CardFooter>
    </Card>
  );
}
