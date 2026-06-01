import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link href="/" className={cn(buttonVariants(), "mt-8")}>
        Back to {siteConfig.name}
      </Link>
    </div>
  );
}
