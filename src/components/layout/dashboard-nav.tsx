"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Video,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  video: Video,
  chart: BarChart3,
  message: MessageSquare,
} as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {siteConfig.dashboardNav.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive = pathname === item.href;
        const isDisabled = "disabled" in item && item.disabled;

        if (isDisabled) {
          return (
            <span
              key={item.title}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.title}
              <span className="ml-auto text-xs">Soon</span>
            </span>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground",
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
