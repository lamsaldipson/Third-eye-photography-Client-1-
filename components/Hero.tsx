import Link from "next/link";
import Image from "next/image";
import WisdomEyeMark from "./WisdomEyeMark";
import { studio } from "@/lib/content";
import type { GalleryImage } from "@/types";

export default function Hero({ featured }: { featured: GalleryImage | null }) {
  return (
    <section className="mx-auto max-w-6xl px-6 md:px-10 pt-14 md:pt-20 pb-16">
      <div className="grid md:grid-cols-12 gap-10 md:gap-6 items-end">
        <div className="md:col-span-7">
          <p className="text-sm text-maroon tracking-wide mb-5">
            {studio.rating.toFixed(1)} rating · {studio.reviewCount} reviews · Kathmandu
          </p>
          <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] text-ink max-w-2xl">
            We photograph the day the way your grandmother will tell it.
          </h1>
          <p className="mt-6 text-ink/70 text-lg max-w-md leading-relaxed">
            Third Eye Photography covers weddings, engagements, and receptions
            across Kathmandu — full days of coverage, honest light, and a
            gallery you'll actually go back to.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/booking" className="btn-primary">
              Check your date
            </Link>
            <Link href="/gallery" className="btn-secondary">
              See the gallery
            </Link>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-maroon">
            {featured ? (
              <Image
                src={featured.url}
                alt={featured.caption || "Wedding photograph by Third Eye Photography"}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 90vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-maroon via-maroon-dark to-ink">
                <WisdomEyeMark className="w-24 h-24 text-marigold/70" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-paperlight px-5 py-4 rounded-sm shadow-[0_8px_30px_-12px_rgba(27,20,16,0.35)]">
            <WisdomEyeMark className="w-9 h-7 text-maroon" />
            <div className="leading-tight">
              <p className="text-sm text-ink">{studio.lgbtqFriendly ? "LGBTQ+ friendly" : "Kathmandu studio"}</p>
              <p className="text-xs text-ink/50">Booking now for 2026 dates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
