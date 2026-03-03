import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md dark:bg-hero-bg/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 md:px-20">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-slate-900" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            <span className="sm:hidden">QI</span>
            <span className="hidden sm:inline">QuickInfographics</span>
          </h2>
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
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-slate-900 transition-transform hover:scale-105"
        >
          Get Started
          <span className="rounded-full bg-slate-900/15 px-1.5 py-0.5 text-[10px] font-bold uppercase">Free</span>
        </Link>
      </div>
    </nav>
  )
}
