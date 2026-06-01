export const siteConfig = {
  name: "Ghost Coach",
  description:
    "AI-powered cricket coaching platform for batsmen — analyze technique, track progress, and improve your game.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  sport: "cricket" as const,
  playerRole: "batsman" as const,
  links: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
  },
  mainNav: [
    { title: "Features", href: "#features" },
    { title: "About", href: "#about" },
  ],
  dashboardNav: [
    { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { title: "Sessions", href: "/dashboard/sessions", icon: "video" },
    { title: "Analysis", href: "/dashboard/analysis", icon: "chart" },
    { title: "Coach Chat", href: "/dashboard/chat", icon: "message" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
