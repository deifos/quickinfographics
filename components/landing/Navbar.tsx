import Link from "next/link";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-border/50 dark:bg-hero-bg/80 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 md:px-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Zap className="h-5 w-5 text-slate-900" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            <span className="sm:hidden">QI</span>
            <span className="hidden sm:inline">QuickInfographics</span>
          </h2>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="hover:text-primary text-sm font-semibold transition-colors"
          >
            How it Works
          </a>
          <a
            href="#gallery"
            className="hover:text-primary text-sm font-semibold transition-colors"
          >
            Gallery
          </a>
          <a
            href="#pricing"
            className="hover:text-primary text-sm font-semibold transition-colors"
          >
            Pricing
          </a>
        </div>

        <Link
          href="/dashboard"
          className="bg-primary flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-slate-900 transition-transform hover:scale-105"
        >
          Get Started
          <span className="rounded-full bg-slate-900/15 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            Free
          </span>
        </Link>
      </div>
    </nav>
  );
}
