import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section
      className="bg-section-bg px-5 py-24 sm:px-8 lg:px-20 dark:bg-slate-900/50"
      id="pricing"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black tracking-tight">
            Simple, Pay-As-You-Go Pricing
          </h2>
          <p className="text-muted-foreground">
            You get 1 free credit to try it out. Need more? Grab a pack — no
            subscriptions, no commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Starter */}
          <div className="border-border/40 flex flex-col rounded-3xl border bg-white p-8 shadow-xl dark:bg-slate-800">
            <h3 className="mb-2 text-xl font-bold">Starter</h3>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black">$4.99</span>
              <span className="text-muted-foreground">/ 5 credits</span>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500" />5 infographic
                credits
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
              className="border-border hover:bg-muted mt-auto block w-full rounded-xl border-2 py-3 text-center font-bold transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Creator — highlighted */}
          <div className="border-primary relative flex scale-105 flex-col rounded-3xl border-2 bg-white p-8 shadow-2xl dark:bg-slate-800">
            <div className="bg-primary absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-slate-900">
              MOST POPULAR
            </div>
            <h3 className="text-primary mb-2 text-xl font-bold">Creator</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$8.99</span>
                <span className="text-muted-foreground">/ 12 credits</span>
              </div>
              <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                Save 25%
              </span>
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
                <Check className="h-5 w-5 text-emerald-500" />2 bonus credits
                included
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="bg-primary shadow-primary/20 mt-auto block w-full rounded-xl py-3 text-center font-bold text-slate-900 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="border-border/40 flex flex-col rounded-3xl border bg-white p-8 shadow-xl dark:bg-slate-800">
            <h3 className="mb-2 text-xl font-bold">Pro</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$19.99</span>
                <span className="text-muted-foreground">/ 30 credits</span>
              </div>
              <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                Save 33%
              </span>
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
              className="border-border hover:bg-muted mt-auto block w-full rounded-xl border-2 py-3 text-center font-bold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
