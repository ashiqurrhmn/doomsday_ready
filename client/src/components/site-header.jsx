"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/movies", label: "Movies" },
  { href: "/rewatch", label: "Rewatch Plan" },
  { href: "/booking", label: "Booking" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/30 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        {/* Left: Clean Minimalist Uppercase Links (Exact match to reference) */}
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-12">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-xs font-bold uppercase tracking-[0.12em] transition-opacity duration-200 sm:text-[13px] ${
                      isActive
                        ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Minimal Search Icon + Circular Avatar Badge */}
        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/movies"
            aria-label="Search or manage movies"
            title="Movies library"
            className="text-white/85 transition hover:scale-110 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
          </Link>

          <Link
            href="/booking"
            aria-label="Watch-party booking"
            title="Watch-party booking"
            className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/80 shadow-[0_4px_14px_rgba(0,0,0,0.5)] transition hover:scale-105 hover:ring-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image
              src="/images/posters/iron-man.jpg"
              alt="Profile avatar"
              fill
              sizes="36px"
              className="object-cover object-top"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
