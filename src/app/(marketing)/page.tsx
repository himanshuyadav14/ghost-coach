import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="mb-4 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Cricket · Batsman Coaching
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Master your batting with{" "}
          <span className="text-primary">{siteConfig.name}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={siteConfig.links.register}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Start Free
          </Link>
          <Link
            href={siteConfig.links.login}
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Sign In
          </Link>
        </div>
      </section>

      <section id="features" className="mx-auto mt-24 max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-semibold">
          Built for batsmen who want to improve
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Technique Analysis",
              description:
                "AI-powered feedback on your batting stance, footwork, and shot selection.",
            },
            {
              title: "Session Tracking",
              description:
                "Log practice sessions and track progress over time with detailed metrics.",
            },
            {
              title: "Personalized Coaching",
              description:
                "Get tailored drills and recommendations based on your skill level and goals.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto mt-24 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold">About Ghost Coach</h2>
        <p className="mt-4 text-muted-foreground">
          Ghost Coach is an AI-powered platform designed specifically for
          cricket batsmen. Whether you&apos;re learning the basics or refining
          advanced techniques, our platform helps you analyze, practice, and
          improve — coming soon.
        </p>
      </section>
    </div>
  );
}
