import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  description: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

export function StatCard({
  title,
  description,
  value,
  subtext,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
