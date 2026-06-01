import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalysisLoading() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Analyzing your technique</CardTitle>
        <CardDescription>
          Our AI coach is reviewing your batting image. This may take a few
          seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="w-full max-w-sm space-y-3">
          <div className="h-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-3/5 animate-pulse rounded-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
