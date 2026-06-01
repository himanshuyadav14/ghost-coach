import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SessionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader className="pb-2">
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}
