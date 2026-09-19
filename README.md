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

Bookings and gallery metadata are stored in `data/bookings.json` and
`data/gallery.json`; uploaded photos are saved to `public/uploads/`. This
keeps the whole project dependency-free and easy to run locally or on any
host with a normal persistent filesystem (a VPS, Docker, Railway,
Render, etc).

**Heads up if you deploy to a serverless platform with a read-only
filesystem (a default Vercel deployment, for example):** writes to those
JSON files and to `public/uploads/` won't persist between requests there.
Every route only talks to the functions in `lib/data.ts`, so swapping in
a real database (Postgres, Supabase) and an object store (S3,
Cloudinary) for uploads is a contained change — you shouldn't need to
touch the page or component code.

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
