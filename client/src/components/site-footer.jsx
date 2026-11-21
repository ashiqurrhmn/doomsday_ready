import Link from "next/link";

import BrandLogo from "@/components/brand-logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05060a]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 py-7 text-xs tracking-wide text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" aria-label="Doomsday Ready home">
            <BrandLogo compact />
          </Link>
          <span aria-hidden="true" className="text-zinc-700">
            ·
          </span>
          <span>Plan the story. Fill every seat.</span>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          <Link href="/movies" className="transition hover:text-zinc-200">
            Movies
          </Link>
          <Link href="/rewatch" className="transition hover:text-zinc-200">
            Rewatch Plan
          </Link>
          <Link href="/booking" className="transition hover:text-zinc-200">
            Booking
          </Link>
        </nav>
      </div>
    </footer>
  );
}
