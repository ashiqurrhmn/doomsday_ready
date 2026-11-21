import Link from "next/link";

const navigation = [
  { href: "/movies", label: "Movies" },
  { href: "/rewatch", label: "Rewatch Plan" },
  { href: "/booking", label: "Booking" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300"
          aria-label="Doomsday Ready home"
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-xl bg-red-600 font-mono text-sm font-bold text-white shadow-lg shadow-red-950/50"
          >
            DR
          </span>
          <span>
            <span className="block font-semibold tracking-tight text-white">
              Doomsday Ready
            </span>
            <span className="block text-sm text-zinc-400">
              Movie marathon planner
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-sm font-medium text-zinc-300">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-red-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
