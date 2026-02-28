# QuickInfographics

Turn any YouTube video into a stunning AI-generated infographic in seconds.

Paste a link, pick a style and aspect ratio, and download a polished infographic summarizing the key points — powered by Gemini AI.

[Live Demo](https://quickinfographics.com)

![QuickInfographics Banner](https://deifos.github.io/images/quickinfographics-banner.jpg)

## Features

- **6 visual styles** — Modern, Cartoon, Minimal, Line Art, Isometric, Flat
- **3 aspect ratios** — Portrait (9:16), Square (1:1), Landscape (16:9)
- **AI-powered analysis** — Gemini 2.5 Flash extracts key points from any YouTube video
- **AI image generation** — Gemini generates a custom infographic from the analysis
- **Step-by-step wizard** — Guided flow: paste URL, pick ratio, pick style, generate
- **Credit-based pricing** — Stripe checkout with 3 plans (Starter, Creator, Pro)
- **Local gallery** — Generated infographics stored in IndexedDB for instant access
- **HD downloads** — Download infographics as high-resolution images
- **Auth** — Google OAuth + email/password via Better Auth
- **Admin dashboard** — Revenue analytics, user stats, purchase history
- **Dark mode** — Full light/dark theme support

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework (App Router) |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [Convex](https://convex.dev) | Backend database & real-time sync |
| [Better Auth](https://www.better-auth.com) | Authentication (Google OAuth + email/password) |
| [Google Gemini AI](https://ai.google.dev) | Video analysis + infographic generation |
| [Stripe](https://stripe.com) | Payments & checkout |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [next-intl](https://next-intl.dev) | Internationalization |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth + Gemini API key)
- A [Stripe](https://stripe.com) account

### 1. Clone & install

```bash
git clone https://github.com/deifos/quickinfographics.git
cd quickinfographics
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
```

Fill in your credentials — see `.env.example` for all required variables and links to where you can get each one.

### 3. Set up Convex

```bash
npx convex dev
```

This will prompt you to create a Convex project and start the local dev backend.

### 4. Set up Stripe webhook (local dev)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` in your `.env`.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate/          # Infographic generation endpoint (Gemini AI)
│   │   └── stripe/            # Stripe checkout & webhook handlers
│   ├── admin/                 # Admin dashboard (protected)
│   ├── auth/login/            # Login page
│   ├── changelog/             # Public changelog
│   ├── dashboard/             # Main app — wizard flow for generating infographics
│   ├── layout.tsx             # Root layout with metadata & providers
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles & animations
├── components/
│   └── ui/                    # shadcn/ui components
├── convex/
│   ├── betterAuth/            # Better Auth + Convex integration
│   ├── admin.ts               # Admin stats query
│   ├── credits.ts             # Credit management (purchase, use, check)
│   └── schema.ts              # Database schema
├── lib/
│   ├── auth.ts                # Auth configuration
│   ├── auth-client.ts         # Auth client (frontend)
│   └── auth-server.ts         # Auth server utilities
├── messages/                  # i18n translation files
└── public/
    └── samples/               # Sample infographic images
```

## Environment Variables

See [`.env.example`](.env.example) for the full list. All secrets are loaded from environment variables — nothing is hardcoded in source.

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `CONVEX_DEPLOYMENT` | Yes | Convex deployment identifier |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex cloud URL |
| `BETTER_AUTH_SECRET` | Yes | Auth encryption secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `WEBHOOK_SECRET` | Yes | Internal webhook verification secret |
| `ADMIN_USER_IDS` | No | Comma-separated admin user IDs |

## Scripts

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

MIT

## Author

Built by [Vlad](https://vladpalacio.com) — part of [getbasedapps](https://getbasedapps.com)
