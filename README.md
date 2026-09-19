# Third Eye Photography — website

A Next.js (App Router) + TypeScript + Tailwind site for Third Eye
Photography, a wedding photography studio in Kathmandu. Built from the
studio's real Google Maps listing: 5.0 rating, 16 reviews, LGBTQ+ friendly,
address M8RP+99M Kathmandu.

## What's included

- **Public site** — home page (hero, about, gallery preview, packages,
  reviews, CTA) and a full gallery page.
- **Booking form** (`/booking`) — couples submit event details; requests
  are saved and show up in the studio dashboard.
- **Studio dashboard** (`/admin`, behind a password at `/admin/login`) —
  upload and delete gallery photos, and review/update booking requests
  (new → contacted → confirmed → declined).

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD in .env.local
npm run dev
```

Visit `http://localhost:3000`. Sign in to the dashboard at
`/admin/login` with the password you set in `.env.local`.

## How data is stored

Locally (`npm run dev`, or any host with a normal persistent disk — a
VPS, Docker, Railway, Render, etc), bookings and gallery metadata are
stored in `data/bookings.json` and `data/gallery.json`, and uploaded
photos are saved to `public/uploads/`. Every route only talks to the
functions in `lib/data.ts` and `lib/uploads.ts`, so this is a
self-contained, dependency-free setup for local development.

**On Cloudflare** (see below), those same functions automatically switch
to Cloudflare KV (bookings + gallery metadata) and an R2 bucket
(uploaded photos) instead, since Workers has no writable, persistent
filesystem. Uploaded photos are served back through
`/api/uploads/[filename]`, which streams them out of R2.

## Deploying to Cloudflare

This app deploys to Cloudflare Workers via the
[OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare), which is
already wired up (`wrangler.jsonc`, `open-next.config.ts`, and the
Cloudflare-aware code in `lib/data.ts` / `lib/uploads.ts`).

1. Install the new dependencies: `npm install`.
2. Log in to Cloudflare: `npx wrangler login`.
3. Create the KV namespace bookings/gallery data will live in:
   ```
   npx wrangler kv namespace create DATA_KV
   ```
   Copy the `id` it prints into `wrangler.jsonc`, replacing
   `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.
4. Create the R2 bucket uploaded photos will live in:
   ```
   npx wrangler r2 bucket create third-eye-photography-uploads
   ```
   (If you'd rather use a different bucket name, update it in
   `wrangler.jsonc` too.)
5. Set the admin password as a Worker secret (this is separate from
   `.env.local`, which only `next dev` reads):
   ```
   npx wrangler secret put ADMIN_PASSWORD
   ```
6. Optionally regenerate binding types after touching `wrangler.jsonc`:
   `npm run cf-typegen`.
7. Preview a production build locally in the actual Workers runtime:
   `npm run preview`. (For this to have a password to check against, copy
   `.dev.vars.example` to `.dev.vars` and set `ADMIN_PASSWORD` there —
   `.dev.vars` is what `wrangler`/`preview` reads locally, separate from
   the Worker secret you set in step 5 for production.)
8. Deploy: `npm run deploy`.

After the first deploy, any bookings or gallery uploads made through the
live `/admin` dashboard are read from and written to that KV namespace
and R2 bucket — nothing further to configure.

## Project structure

```
app/
  page.tsx              Home page
  gallery/page.tsx       Full gallery
  booking/page.tsx        Booking page + BookingForm.tsx (client)
  admin/page.tsx           Dashboard (protected) + AdminDashboard.tsx
  admin/login/page.tsx      Login page + LoginForm.tsx
  api/bookings/route.ts      Create + list bookings
  api/bookings/[id]/route.ts  Update a booking's status
  api/gallery/route.ts        List + upload photos
  api/gallery/[id]/route.ts    Delete a photo
  api/admin/login/route.ts      Password check, sets session cookie
  api/admin/logout/route.ts      Clears session cookie
components/               Header, Footer, Hero, GalleryGrid, ReviewsSection, WisdomEyeMark
lib/
  data.ts                 Reads/writes the JSON "datastore"
  auth.ts                 Password + session cookie helpers
  content.ts              Studio info, reviews, packages (real content)
middleware.ts             Redirects unauthenticated visitors away from /admin
```

## Notes on the design

- Type: **Fraunces** for headlines, **Manrope** for body/UI text.
- Color: warm ivory paper, deep maroon (sindoor red), and marigold gold —
  drawn from the wedding and festival palette rather than a generic
  template palette.
- The linework eye mark (`components/WisdomEyeMark.tsx`) is an original,
  simplified illustration — used once, in the hero — that nods to the
  valley's temple iconography without reproducing any specific artwork.

## Production checklist

- Set a strong, unique `ADMIN_PASSWORD`.
- If you deploy somewhere with a read-only filesystem, move
  `lib/data.ts` and the upload handler in `app/api/gallery/route.ts`
  onto a real database + object storage (see above).
- Replace the placeholder hero art with real photos — the moment you
  upload one from the dashboard, it becomes the homepage hero image
  automatically.
