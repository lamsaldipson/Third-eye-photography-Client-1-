import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 flex items-center justify-between h-20">
        <Link
          href="/"
          className="font-display text-xl md:text-2xl tracking-tight text-ink"
        >
          Third Eye <span className="text-maroon">Photography</span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-8 text-sm">
          <Link
            href="/gallery"
            className="hidden sm:inline text-ink/75 hover:text-ink transition-colors"
          >
            Gallery
          </Link>
          <a
            href="/#about"
            className="hidden sm:inline text-ink/75 hover:text-ink transition-colors"
          >
            About
          </a>
          <a
            href="/#reviews"
            className="hidden sm:inline text-ink/75 hover:text-ink transition-colors"
          >
            Reviews
          </a>
          <Link href="/booking" className="btn-primary !py-2.5 !px-5">
            Check your date
          </Link>
        </nav>
      </div>
    </header>
  );
}
