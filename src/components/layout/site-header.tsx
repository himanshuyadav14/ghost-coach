import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={siteConfig.links.login}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Log in
          </Link>
          <Link
            href={siteConfig.links.register}
            className={cn(buttonVariants())}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
