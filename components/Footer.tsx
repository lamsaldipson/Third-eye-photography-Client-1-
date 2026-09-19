import Link from "next/link";
import { studio } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-ink text-paperlight mt-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg mb-3">Third Eye Photography</p>
          <p className="text-paperlight/70 text-sm leading-relaxed max-w-xs">
            {studio.address}
          </p>
          <a
            href={studio.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-marigold hover:text-marigold-light underline underline-offset-4 mt-2 inline-block"
          >
            Get directions
          </a>
        </div>

        <div>
          <p className="text-sm uppercase-none text-paperlight/50 mb-3">
            Reach us
          </p>
          <a
            href={studio.phoneHref}
            className="block text-sm text-paperlight/85 hover:text-marigold transition-colors mb-1.5"
          >
            {studio.phone}
          </a>
          <a
            href={`https://${studio.website}`}
            target="_blank"
            rel="noreferrer"
            className="block text-sm text-paperlight/85 hover:text-marigold transition-colors"
          >
            {studio.website}
          </a>
          {studio.lgbtqFriendly && (
            <p className="text-sm text-paperlight/60 mt-4">LGBTQ+ friendly studio</p>
          )}
        </div>

        <div>
          <p className="text-sm text-paperlight/50 mb-3">Studio hours</p>
          <ul className="text-sm text-paperlight/85 space-y-1">
            {studio.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-6 max-w-[220px]">
                <span className="text-paperlight/60">{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-paperlight/10">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-5 flex items-center justify-between text-xs text-paperlight/40">
          <span>&copy; {new Date().getFullYear()} Third Eye Photography</span>
          <Link href="/admin/login" className="hover:text-paperlight/70 transition-colors">
            Studio login
          </Link>
        </div>
      </div>
    </footer>
  );
}
