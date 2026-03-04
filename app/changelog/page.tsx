import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

const changelog = [
  {
    version: "1.4.0",
    date: "2026-03-03",
    title: "Developer Experience",
    latest: true,
    changes: [
      {
        type: "added" as const,
        text: "Prettier code formatter with Tailwind class sorting plugin",
      },
      {
        type: "added" as const,
        text: "npm run format and format:check scripts for pre-push formatting",
      },
      {
        type: "added" as const,
        text: "eslint-config-prettier to prevent ESLint and Prettier conflicts",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-03-03",
    title: "UX Polish",
    latest: false,
    changes: [
      {
        type: "added" as const,
        text: "Auto-scroll to preview after infographic generation",
      },
      {
        type: "added" as const,
        text: "New sample infographic in the landing page gallery",
      },
      {
        type: "fixed" as const,
        text: "Currency formatting now correctly accepts dollars instead of cents",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-03-02",
    title: "Analytics & Admin Access",
    latest: false,
    changes: [
      {
        type: "added" as const,
        text: "Umami analytics integration via environment variable",
      },
      {
        type: "added" as const,
        text: "Admin dashboard link in header for admin users",
      },
      {
        type: "added" as const,
        text: "Hero image animated glow border on hover",
      },
      {
        type: "changed" as const,
        text: "Primary color tuned to match production oklch values",
      },
      {
        type: "fixed" as const,
        text: "Pricing card buttons now aligned at the bottom across all tiers",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-03-02",
    title: "Production Ready",
    latest: false,
    changes: [
      {
        type: "added" as const,
        text: "Full SEO setup — Open Graph image, meta tags, sitemap, and robots.txt",
      },
      {
        type: "added" as const,
        text: "Custom 404 and error pages with animated visuals",
      },
      {
        type: "added" as const,
        text: "Favicon and web manifest for PWA support",
      },
      { type: "added" as const, text: "Dashboard loading state with spinner" },
      {
        type: "changed" as const,
        text: "Refactored landing page into clean reusable components",
      },
      {
        type: "changed" as const,
        text: "Moved admin IDs from hardcoded values to environment variables",
      },
      {
        type: "changed" as const,
        text: "Open-sourced project with comprehensive README and .env.example",
      },
      {
        type: "fixed" as const,
        text: "Gallery videos not displaying due to CSS columns positioning bug",
      },
      {
        type: "fixed" as const,
        text: "Green border artifact on gallery items",
      },
      { type: "fixed" as const, text: "Gallery titles disappearing on hover" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-02",
    title: "Initial Launch",
    latest: false,
    changes: [
      {
        type: "added" as const,
        text: "6 infographic styles — Modern, Cartoon, Minimal, Line Art, Isometric, Flat",
      },
      {
        type: "added" as const,
        text: "AI-powered YouTube video analysis with Gemini 2.5 Flash",
      },
      {
        type: "added" as const,
        text: "AI image generation with Gemini 3.1 Flash",
      },
      {
        type: "added" as const,
        text: "3 aspect ratios — Portrait (9:16), Square (1:1), Landscape (16:9)",
      },
      {
        type: "added" as const,
        text: "Step-by-step wizard flow for generating infographics",
      },
      {
        type: "added" as const,
        text: "Credit-based pricing with Stripe checkout",
      },
      {
        type: "added" as const,
        text: "Google OAuth and email/password authentication",
      },
      { type: "added" as const, text: "Local gallery with IndexedDB storage" },
      { type: "added" as const, text: "HD infographic downloads" },
      {
        type: "added" as const,
        text: "Admin dashboard with revenue analytics",
      },
    ],
  },
];

const typeBadgeStyles: Record<string, string> = {
  added: "bg-black text-white dark:bg-white dark:text-black",
  fixed: "bg-black/60 text-white dark:bg-white/60 dark:text-black",
  changed: "bg-black/80 text-white dark:bg-white/80 dark:text-black",
  removed: "bg-black/40 text-white dark:bg-white/40 dark:text-black",
};

export default function ChangelogPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Nav */}
      <nav className="border-border/50 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Zap className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              QuickInfographics
            </span>
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-5 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">Changelog</h1>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              v{changelog[0].version}
            </span>
          </div>
          <p className="text-muted-foreground mt-3">
            Track all updates, improvements, and fixes to QuickInfographics.
            Building in public, one release at a time.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="bg-border absolute top-2 bottom-0 left-[11px] w-px" />

          <div className="space-y-10">
            {changelog.map((release) => (
              <div key={release.version} className="relative pl-10">
                {/* Dot */}
                <div
                  className={`border-background absolute top-1.5 left-0 h-[22px] w-[22px] rounded-full border-[3px] ${
                    release.latest
                      ? "bg-foreground shadow-foreground/20 shadow-[0_0_0_3px]"
                      : "bg-background border-border"
                  }`}
                >
                  {release.latest && (
                    <div className="bg-foreground/30 absolute inset-0 animate-ping rounded-full" />
                  )}
                </div>

                {/* Header */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">v{release.version}</h2>
                    {release.latest && (
                      <span className="bg-foreground text-background rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                        Latest
                      </span>
                    )}
                    <span className="text-muted-foreground text-sm">
                      {new Date(release.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {release.title && (
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                      {release.title}
                    </p>
                  )}
                </div>

                {/* Changes */}
                <div className="border-border/60 bg-card rounded-xl border">
                  {release.changes.map((change, i) => (
                    <div
                      key={i}
                      className={`hover:bg-muted/50 flex items-start gap-3 px-4 py-3 transition-colors ${
                        i !== release.changes.length - 1
                          ? "border-border/40 border-b"
                          : ""
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${typeBadgeStyles[change.type]}`}
                      >
                        {change.type}
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {change.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* The beginning */}
            <div className="relative pl-10">
              <div className="border-background bg-muted absolute top-1 left-0 h-[22px] w-[22px] rounded-full border-[3px]" />
              <p className="text-muted-foreground/60 text-sm font-medium">
                The beginning
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
