# Church Hub — demo

Clickable demo of Church Hub: members, giving, events, the academy and safe child check-in, in one place.

Live: https://church-hub-demo.netlify.app

All data is fictional (`src/lib/demo-data.ts`). Nothing is saved and no payments are taken.

## Member app (`/me`)

Phone-first app for members and parents. Start at `/sign-in` (email or phone code; any 6 digits works in the demo):

- **Home** — today's academy check-in status, recurring gift, upcoming events, announcements
- **Give** — amount, fund, frequency, saved bank or card, fee cover, giving history and tax statement
- **Events** — register family members, waivers, pay with saved card
- **Family** — pickup code, children and allergies, authorized pickup, re-enroll for next term

## Admin screens

- **Dashboard** — giving, households, registrations and enrollment at a glance
- **Members** — households, children, allergies and authorized pickup
- **Giving** — one-time and recurring gifts by fund, optional fee cover
- **Events** — registration with guest checkout and waivers
- **Classes & enrollment** — age-based class placement, sibling and member discounts, payment plans
- **Child check-in** — family search, matching child/parent tags, allergy alerts, verified pickup

## Stack

Next.js 16 (static export), Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) (Radix, Nova preset), lucide icons.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`, which Netlify publishes (see `netlify.toml`).
