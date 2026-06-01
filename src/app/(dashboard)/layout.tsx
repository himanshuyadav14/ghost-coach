import Link from "next/link";
import { Home } from "lucide-react";

import { siteConfig } from "@/config/site";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 md:block">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="font-semibold">
            {siteConfig.name}
          </Link>
        </div>
        <DashboardNav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:gap-4 sm:px-4">
          <MobileNav />
          <div className="flex-1" />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              aria-label="Home"
            >
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
