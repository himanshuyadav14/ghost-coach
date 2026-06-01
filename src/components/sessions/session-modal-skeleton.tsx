import { Skeleton } from "@/components/ui/skeleton";

export function SessionModalSkeleton() {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-36 w-36 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
