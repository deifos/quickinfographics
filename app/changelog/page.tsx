import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

const changelog = [
  {
    version: '1.0.0',
    date: '2026-03-02',
    title: 'Initial Launch',
    latest: true,
    changes: [
      { type: 'added' as const, text: '6 infographic styles — Modern, Cartoon, Minimal, Line Art, Isometric, Flat' },
      { type: 'added' as const, text: 'AI-powered YouTube video analysis with Gemini 2.5 Flash' },
      { type: 'added' as const, text: 'AI image generation with Gemini 3.1 Flash' },
      { type: 'added' as const, text: '3 aspect ratios — Portrait (9:16), Square (1:1), Landscape (16:9)' },
      { type: 'added' as const, text: 'Step-by-step wizard flow for generating infographics' },
      { type: 'added' as const, text: 'Credit-based pricing with Stripe checkout' },
      { type: 'added' as const, text: 'Google OAuth and email/password authentication' },
      { type: 'added' as const, text: 'Local gallery with IndexedDB storage' },
      { type: 'added' as const, text: 'HD infographic downloads' },
      { type: 'added' as const, text: 'Admin dashboard with revenue analytics' },
    ],
  },
]

const typeBadgeStyles: Record<string, string> = {
  added: 'bg-black text-white dark:bg-white dark:text-black',
  fixed: 'bg-black/60 text-white dark:bg-white/60 dark:text-black',
  changed: 'bg-black/80 text-white dark:bg-white/80 dark:text-black',
  removed: 'bg-black/40 text-white dark:bg-white/40 dark:text-black',
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-lg font-bold tracking-tight">QuickInfographics</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              v{changelog[0].version}
            </span>
          </div>
          <p className="mt-3 text-muted-foreground">
            Track all updates, improvements, and fixes to QuickInfographics. Building in public, one release at a time.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-0 w-px bg-border" />

          <div className="space-y-10">
            {changelog.map((release) => (
              <div key={release.version} className="relative pl-10">
                {/* Dot */}
                <div className={`absolute left-0 top-1.5 h-[22px] w-[22px] rounded-full border-[3px] border-background ${
                  release.latest
                    ? 'bg-foreground shadow-[0_0_0_3px] shadow-foreground/20'
                    : 'bg-background border-border'
                }`}>
                  {release.latest && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-foreground/30" />
                  )}
                </div>

                {/* Header */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">v{release.version}</h2>
                    {release.latest && (
                      <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold text-background">
                        Latest
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(release.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {release.title && (
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{release.title}</p>
                  )}
                </div>

                {/* Changes */}
                <div className="rounded-xl border border-border/60 bg-card">
                  {release.changes.map((change, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
                        i !== release.changes.length - 1 ? 'border-b border-border/40' : ''
                      }`}
                    >
                      <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${typeBadgeStyles[change.type]}`}>
                        {change.type}
                      </span>
                      <p className="text-sm text-muted-foreground">{change.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* The beginning */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 h-[22px] w-[22px] rounded-full border-[3px] border-background bg-muted" />
              <p className="text-sm font-medium text-muted-foreground/60">The beginning</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-5 py-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://x.com/deifosv" target="_blank" rel="noopener noreferrer">
              <img src="/vlad-pfp.jpg" alt="Vlad" className="h-7 w-7 rounded-full transition-opacity hover:opacity-80" />
            </a>
            <span className="text-sm text-muted-foreground">
              Built by{' '}
              <a href="https://vladpalacio.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary">
                Vlad
              </a>
            </span>
            <a href="https://x.com/deifosv" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-label="X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://github.com/deifos/quickinfographics" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-label="GitHub">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Part of</span>
            <a
              href="https://getbasedapps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-slate-900"
            >
              getbasedapps
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
