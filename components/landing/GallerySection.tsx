const SAMPLES = [
  { id: 't8wulNsNYc8', title: 'App Gold Rush', tilt: 'rotate-[-2deg]' },
  { id: '0LnLn2MK62A', title: 'Compound Growth', tilt: 'rotate-[1.5deg]' },
  { id: '9r4kS9zZj9s', title: 'UGC Strategy', tilt: 'rotate-[2deg]' },
  { id: 'qIlX7cQ2UdU', title: 'Key Takeaways', tilt: 'rotate-[-1.5deg]' },
]

export function GallerySection() {
  return (
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
          {SAMPLES.map((item) => (
            <div key={item.id} className={`mb-10 break-inside-avoid ${item.tilt} transition-transform duration-500 hover:rotate-0`}>
              {/* Glow wrapper + infographic */}
              <div className="gallery-item">
                <img
                  src={`/samples/${item.id}.webp`}
                  alt={item.title}
                  className="relative z-0 w-full rounded-2xl"
                />
              </div>
              {/* Title — overlaps bottom of infographic */}
              <div className="relative z-[2] -mt-6 text-center">
                <h3 className="inline-block rounded-xl border-2 border-white/20 bg-slate-900/80 px-5 py-2 text-base font-extrabold tracking-tight text-white shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/90">
                  {item.title}
                </h3>
              </div>
              {/* Video embed — relative with negative margin to overlap infographic */}
              <div className="relative z-10 -mt-4 ml-2 w-[130px] sm:w-[150px] lg:w-[180px]">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
