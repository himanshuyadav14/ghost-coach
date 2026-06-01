"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SessionSummary } from "@/types/coaching";
import { getScoreColor } from "@/components/analysis/coaching-report-content";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  score: number;
  fullDate: string;
  id: string;
}

interface ProgressChartProps {
  sessions: SessionSummary[];
  isLoading?: boolean;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{point.fullDate}</p>
      <p className={cn("text-lg font-bold", getScoreColor(point.score))}>
        Score: {point.score}
      </p>
    </div>
  );
}

export function ProgressChart({ sessions, isLoading }: ProgressChartProps) {
  const [primaryColor, setPrimaryColor] = useState("oklch(0.205 0 0)");

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
    if (color) setPrimaryColor(color);
  }, []);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    return [...sessions]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((session) => ({
        date: formatDate(session.createdAt, { month: "short", day: "numeric" }),
        score: session.overallScore,
        fullDate: formatDate(session.createdAt, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        id: session.id,
      }));
  }, [sessions]);

  if (isLoading) {
    return <Skeleton className="h-[280px] w-full sm:h-[320px]" />;
  }

  if (chartData.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No progress data yet"
        description="Complete your first technique analysis to start tracking your improvement"
        action={{ label: "Start Analysis", href: "/dashboard/analysis" }}
        className="border-none shadow-none"
      />
    );
  }

  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke={primaryColor}
          strokeWidth={2}
          dot={{ fill: primaryColor, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressChartSkeleton() {
  return <Skeleton className="h-[280px] w-full sm:h-[320px]" />;
}
