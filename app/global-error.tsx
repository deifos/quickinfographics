"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f8f8",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textAlign: "center",
          padding: "20px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(25, 217, 230, 0.08)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(25, 217, 230, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#19d9e6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0d1117",
              margin: "0 0 8px",
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
              maxWidth: "400px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Don&apos;t worry, your data is safe.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                background: "#19d9e6",
                color: "#0d1117",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(25, 217, 230, 0.3)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "transparent",
                color: "#0d1117",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                padding: "12px 24px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Back to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
