"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { siteConfig } from "@/config/site";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUIStore } from "@/store/ui.store";

export function MobileNav() {
  const { isMobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetTrigger className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <DashboardNav />
        <div className="border-t p-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Back to home
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
