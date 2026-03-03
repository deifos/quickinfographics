import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-5 py-8 sm:px-8 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <a href="https://x.com/deifosv" target="_blank" rel="noopener noreferrer">
            <img
              src="/vlad-pfp.jpg"
              alt="Vlad"
              className="h-8 w-8 rounded-full transition-opacity hover:opacity-80"
            />
          </a>
          <span className="text-sm text-muted-foreground">
            Built by{' '}
            <a
              href="https://vladpalacio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Vlad
            </a>
          </span>
          <a href="https://x.com/deifosv" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-label="X">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <span className="text-muted-foreground/40">·</span>
          <Link
            href="/changelog"
            className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            v1.1.0
          </Link>
          <span className="text-muted-foreground/40">·</span>
          <a href="https://github.com/deifos/quickinfographics" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-label="GitHub">
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
  )
}
