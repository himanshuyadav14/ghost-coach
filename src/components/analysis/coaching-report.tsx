"use client";

import Link from "next/link";
import { MessageSquare, RotateCcw } from "lucide-react";

import type { CoachingReport } from "@/types/coaching";
import { CoachingReportContent } from "@/components/analysis/coaching-report-content";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CoachingReportViewProps {
  report: CoachingReport;
  sessionId?: string;
  onAnalyzeAnother?: () => void;
}

export function CoachingReportView({
  report,
  sessionId,
  onAnalyzeAnother,
}: CoachingReportViewProps) {
  return (
    <div className="space-y-6">
      <CoachingReportContent report={report} />
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {sessionId && (
          <>
            <Link
              href="/dashboard/sessions"
              className={cn(buttonVariants({ variant: "default" }), "flex-1 sm:flex-none")}
            >
              View in History
            </Link>
            <Link
              href={`/dashboard/chat?sessionId=${sessionId}`}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1 sm:flex-none")}
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Coach
            </Link>
          </>
        )}
        {onAnalyzeAnother && (
          <Button
            variant="outline"
            onClick={onAnalyzeAnother}
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="h-4 w-4" />
            Analyze another image
          </Button>
        )}
      </div>
    </div>
  );
}
