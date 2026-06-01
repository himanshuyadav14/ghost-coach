import { cn } from "@/lib/utils";

interface FormMessageProps {
  message?: string;
  type?: "error" | "success" | "info";
  className?: string;
}

export function FormMessage({
  message,
  type = "error",
  className,
}: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={cn(
        "text-sm",
        type === "error" && "text-destructive",
        type === "success" && "text-green-600 dark:text-green-400",
        type === "info" && "text-muted-foreground",
        className,
      )}
    >
      {message}
    </p>
  );
}
