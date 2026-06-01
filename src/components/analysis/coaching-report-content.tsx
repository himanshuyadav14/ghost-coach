"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Target,
  TrendingUp,
} from "lucide-react";

import type { CoachingReport } from "@/types/coaching";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CoachingReportContentProps {
  report: CoachingReport;
  className?: string;
  showScoreRing?: boolean;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreRingColor(score: number): string {
  if (score >= 75) return "stroke-green-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

export function getConfidenceStyles(
  level: CoachingReport["confidenceLevel"],
): string {
  switch (level) {
    case "High":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "Medium":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    case "Low":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
  }
}

export function getScoreBadgeStyles(score: number): string {
  if (score >= 75) return "bg-green-500/10 text-green-700 dark:text-green-400";
  if (score >= 50) return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  return "bg-red-500/10 text-red-700 dark:text-red-400";
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="-rotate-90 transform" width="144" height="144">
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-muted"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700", getScoreRingColor(score))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold", getScoreColor(score))}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">Overall Score</span>
      </div>
    </div>
  );
}

export function CoachingReportContent({
  report,
  className,
  showScoreRing = true,
}: CoachingReportContentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Coaching Report
              </CardTitle>
              <CardDescription>
                AI-powered batting technique analysis
              </CardDescription>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                getConfidenceStyles(report.confidenceLevel),
              )}
            >
              {report.confidenceLevel} Confidence
            </span>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "pt-8",
            showScoreRing
              ? "flex flex-col items-center gap-8 lg:flex-row lg:items-start"
              : "space-y-6",
          )}
        >
          {showScoreRing && <ScoreRing score={report.overallScore} />}
          <div
            className={cn(
              "grid w-full gap-6",
              showScoreRing ? "flex-1 md:grid-cols-2" : "md:grid-cols-2",
            )}
          >
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {report.areasToImprove.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-primary" />
              Priority Fix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {report.priorityFix}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Drill Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {report.drillSuggestion}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
