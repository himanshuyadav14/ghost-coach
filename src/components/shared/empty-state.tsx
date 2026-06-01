import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className="flex justify-center pb-6">
          <Link href={action.href} className={cn(buttonVariants())}>
            {action.label}
          </Link>
        </CardContent>
      )}
    </Card>
  );
}
