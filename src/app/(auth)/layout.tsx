import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-xl font-semibold hover:opacity-80 transition-opacity"
      >
        {siteConfig.name}
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
