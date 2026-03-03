import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
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
              Paste a YouTube link, pick your style and aspect ratio, and get a beautiful infographic in seconds.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-slate-900 shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 sm:text-lg"
            >
              Create My First Infographic
              <span className="rounded-full bg-slate-900/15 px-2 py-0.5 text-[10px] font-bold uppercase sm:text-xs">Free</span>
            </Link>
          </div>

          {/* Right — Big infographic + small video embed */}
          <div className="relative mx-auto w-full lg:mx-0">
            {/* Animated glow border on hover */}
            <div className="hero-glow-border rounded-2xl">
              <img
                src="/samples/t8wulNsNYc8.webp"
                alt="AI-generated infographic from YouTube video"
                className="relative z-0 w-full rounded-2xl"
              />
            </div>
            {/* Small embedded video — bottom-left corner */}
            <div className="absolute -bottom-5 -left-3 z-10 w-[180px] sm:-left-5 sm:w-[220px] lg:w-[260px]">
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
  )
}
