import { Link2, Sparkles, Download } from 'lucide-react'

export function HowItWorks() {
  return (
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
              Copy any YouTube video URL and paste it in. Then pick your style and aspect ratio — portrait, landscape, or square.
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
  )
}
