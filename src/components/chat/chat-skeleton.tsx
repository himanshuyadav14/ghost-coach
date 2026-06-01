import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col rounded-xl border bg-card sm:min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-full sm:w-48" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex justify-start">
          <Skeleton className="h-16 w-3/4 max-w-sm rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-12 w-2/3 max-w-xs rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-20 w-4/5 max-w-md rounded-2xl" />
        </div>
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}
