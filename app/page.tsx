import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Link2,
  Download,
  Check,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ===== Navigation ===== */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md dark:bg-hero-bg/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 md:px-20">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-slate-900" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">QuickInfographics</h2>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-semibold transition-colors hover:text-primary">
              How it Works
            </a>
            <a href="#gallery" className="text-sm font-semibold transition-colors hover:text-primary">
              Gallery
            </a>
            <a href="#pricing" className="text-sm font-semibold transition-colors hover:text-primary">
              Pricing
            </a>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-slate-900 transition-transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative px-5 pt-10 pb-12 sm:px-8 md:pt-16 md:pb-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
            {/* Left — Copy */}
            <div className="flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-500">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Visualization
              </div>

              <h1 className="hero-shimmer text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                Turn YouTube videos into{' '}
                <span className="text-primary">stunning</span>{' '}
                infographics.
              </h1>

              <p className="text-sm text-muted-foreground sm:text-base">
                Paste a YouTube link, pick your aspect ratio, and let AI generate a beautiful infographic — in seconds.
              </p>

              <Link
                href="/dashboard"
                className="w-fit rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-slate-900 shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 sm:text-lg"
              >
                Create My First Infographic
              </Link>
            </div>

            {/* Right — Big infographic + small video embed */}
            <div className="relative mx-auto w-full lg:mx-0">
              <img
                src="/samples/t8wulNsNYc8.webp"
                alt="AI-generated infographic from YouTube video"
                className="w-full rounded-2xl shadow-2xl"
              />
              {/* Small embedded video — bottom-left corner */}
              <div className="absolute -bottom-5 -left-3 w-[180px] sm:-left-5 sm:w-[220px] lg:w-[260px]">
                <div className="overflow-hidden rounded-xl shadow-xl ring-4 ring-white dark:ring-slate-900">
                  <iframe
                    src="https://www.youtube.com/embed/t8wulNsNYc8"
                    title="Source YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Transformation Gallery ===== */}
      <section className="px-5 py-24 sm:px-8 lg:px-20" id="gallery">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight">See What&apos;s Possible</h2>
            <p className="text-muted-foreground">
              From any YouTube video to a polished infographic — here&apos;s what our AI can create.
            </p>
          </div>

          {/* Masonry-style tilted grid — columns flow independently */}
          <div className="columns-1 gap-10 sm:columns-2 lg:gap-14">
            {[
              { id: 't8wulNsNYc8', title: 'App Gold Rush', tilt: 'rotate-[-2deg]' },
              { id: '0LnLn2MK62A', title: 'Compound Growth', tilt: 'rotate-[1.5deg]' },
              { id: '9r4kS9zZj9s', title: 'UGC Strategy', tilt: 'rotate-[2deg]' },
              { id: 'qIlX7cQ2UdU', title: 'Key Takeaways', tilt: 'rotate-[-1.5deg]' },
            ].map((item) => (
              <div key={item.id} className={`mb-10 break-inside-avoid ${item.tilt} transition-transform duration-500 hover:rotate-0`}>
                {/* Glow wrapper + infographic */}
                <div className="gallery-item">
                  <img
                    src={`/samples/${item.id}.webp`}
                    alt={item.title}
                    className="relative z-0 w-full rounded-2xl"
                  />
                </div>
                {/* Video embed — relative with negative margin to overlap infographic */}
                <div className="relative z-10 -mt-8 ml-2 w-[130px] sm:w-[150px] lg:w-[180px]">
                  <div className="overflow-hidden rounded-lg shadow-xl ring-4 ring-white dark:ring-slate-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.id}`}
                      title={`Source: ${item.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </div>
                </div>
                <p className="mt-2 text-center text-sm font-bold">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="px-5 py-24 sm:px-8 lg:px-20" id="how-it-works">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
              Go from a YouTube link to a downloadable infographic in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:rotate-6">
                <Link2 className="h-9 w-9" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">1. Paste a YouTube Link</h3>
              <p className="text-muted-foreground">
                Copy any YouTube video URL and paste it in. Then pick your preferred aspect ratio — portrait, landscape, or square.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-500 transition-transform group-hover:rotate-6">
                <Sparkles className="h-9 w-9" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">2. AI Does the Work</h3>
              <p className="text-muted-foreground">
                Our AI watches the video, pulls out the key points, and designs a clean infographic — all in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:rotate-6">
                <Download className="h-9 w-9" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">3. Download &amp; Share</h3>
              <p className="text-muted-foreground">
                Your infographic is ready. Download it in high resolution and share it anywhere — social media, presentations, or your blog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pricing Section ===== */}
      <section className="bg-section-bg px-5 py-24 sm:px-8 dark:bg-slate-900/50 lg:px-20" id="pricing">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight">Simple, Pay-As-You-Go Pricing</h2>
            <p className="text-muted-foreground">
              You get 1 free credit to try it out. Need more? Grab a pack — no subscriptions, no commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-3xl border border-border/40 bg-white p-8 shadow-xl dark:bg-slate-800">
              <h3 className="mb-2 text-xl font-bold">Starter</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black">$4.99</span>
                <span className="text-muted-foreground">/ 5 credits</span>
              </div>
              <ul className="mb-8 space-y-4">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  5 infographic credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  All 3 aspect ratios
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  HD quality downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Credits never expire
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl border-2 border-border py-3 text-center font-bold transition-colors hover:bg-muted"
              >
                Get Started
              </Link>
            </div>

            {/* Creator — highlighted */}
            <div className="relative scale-105 rounded-3xl border-2 border-primary bg-white p-8 shadow-2xl dark:bg-slate-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-slate-900">
                MOST POPULAR
              </div>
              <h3 className="mb-2 text-xl font-bold text-primary">Creator</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">$8.99</span>
                  <span className="text-muted-foreground">/ 12 credits</span>
                </div>
                <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">Save 25%</span>
              </div>
              <ul className="mb-8 space-y-4">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">12 infographic credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  All 3 aspect ratios
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  HD quality downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Credits never expire
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  2 bonus credits included
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl bg-primary py-3 text-center font-bold text-slate-900 shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-border/40 bg-white p-8 shadow-xl dark:bg-slate-800">
              <h3 className="mb-2 text-xl font-bold">Pro</h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">$19.99</span>
                  <span className="text-muted-foreground">/ 30 credits</span>
                </div>
                <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">Save 33%</span>
              </div>
              <ul className="mb-8 space-y-4">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">30 infographic credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  All 3 aspect ratios
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  HD quality downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Credits never expire
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Best price per infographic
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl border-2 border-border py-3 text-center font-bold transition-colors hover:bg-muted"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
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
              v1.0.0
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
    </div>
  )
}
