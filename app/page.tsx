import Link from "next/link";
import Hero from "@/components/Hero";
import GalleryGrid from "@/components/GalleryGrid";
import ReviewsSection from "@/components/ReviewsSection";
import { getGallery } from "@/lib/data";
import { packages } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await getGallery();
  const preview = images.slice(0, 5);

  return (
    <>
      <Hero featured={images[0] ?? null} />

      <section id="about" className="mx-auto max-w-6xl px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="text-sm text-maroon mb-4">About the studio</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink max-w-sm">
              Kathmandu weddings, told without staging.
            </h2>
          </div>
          <div className="max-w-prose">
            <p className="text-ink/75 leading-relaxed">
              Third Eye Photography works weddings, engagements, and
              receptions across the valley — from small courtyard ceremonies
              to full three-day celebrations. We shoot the ritual moments
              your family expects, and the unscripted ones in between: the
              nervous pacing before the janti arrives, a grandmother
              adjusting a dhaka topi, the walk out after the last saptapadi
              step.
            </p>
            <p className="text-ink/75 leading-relaxed mt-4">
              Every wedding gets a same-week preview gallery, and every
              final set is edited and delivered by hand — no batch filters,
              no templates.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 md:px-10 py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-8">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Recent work</h2>
          <Link
            href="/gallery"
            className="text-sm text-maroon hover:text-maroon-dark underline underline-offset-4"
          >
            View full gallery
          </Link>
        </div>
        <GalleryGrid images={preview} />
      </section>

      <section className="bg-paperlight border-y border-ink/10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16">
          <p className="text-sm text-maroon mb-4">Packages</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink mb-10 max-w-md">
            Three ways to work with us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {packages.map((pkg, i) => (
              <div
                key={pkg.id}
                className={`pt-5 ${i > 0 ? "md:border-l md:border-ink/10 md:pl-6" : ""}`}
              >
                <h3 className="font-display text-xl text-ink">{pkg.name}</h3>
                <p className="text-sm text-maroon/80 mt-1 mb-3">{pkg.subtitle}</p>
                <p className="text-ink/70 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-ink/50 text-sm mt-10">
            Exact pricing depends on your date, venue, and coverage hours —
            tell us the details on the booking form and we'll follow up
            with a quote.
          </p>
        </div>
      </section>

      <ReviewsSection />

      <section className="bg-maroon">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="font-display text-3xl sm:text-4xl text-paperlight max-w-md">
            Let's plan your day.
          </h2>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center bg-marigold text-ink px-7 py-3.5 rounded-sm text-[0.95rem] tracking-wide hover:bg-marigold-light transition-colors"
          >
            Start a booking request
          </Link>
        </div>
      </section>
    </>
  );
}
