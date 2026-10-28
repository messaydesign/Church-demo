# Church Hub — demo

Clickable demo of Church Hub: members, giving, events, the academy and safe child check-in, in one place.

Live: https://church-hub-demo.netlify.app

All data is fictional (`src/lib/demo-data.ts`). Nothing is saved and no payments are taken.

## Screens

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
