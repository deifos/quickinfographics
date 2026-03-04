import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 animate-float-1 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/8 animate-float-2 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 animate-float-3 absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Logo */}
        <div className="bg-primary shadow-primary/20 mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
          <Zap className="h-8 w-8 text-slate-900" />
        </div>

        {/* Giant 404 with gradient */}
        <h1 className="from-foreground to-muted-foreground/50 mb-3 bg-gradient-to-b bg-clip-text text-[120px] leading-none font-black tracking-tighter text-transparent sm:text-[160px]">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Page not found
        </h2>
        <p className="text-muted-foreground mx-auto mb-10 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-primary shadow-primary/20 hover:shadow-primary/30 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-slate-900 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
