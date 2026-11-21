import Link from "next/link";

const views = [
  {
    label: "Movie library",
    title: "Track the story",
    description:
      "Add movies, connect their prerequisites, and mark what you have already watched.",
    href: "/movies",
    linkLabel: "Open movies",
  },
  {
    label: "Rewatch planner",
    title: "Build the right order",
    description:
      "Choose a target movie and get every required movie in a safe viewing order.",
    href: "/rewatch",
    linkLabel: "Open rewatch plan",
  },
  {
    label: "Cinema booking",
    title: "Fill every seat",
    description:
      "Match a group to exact cinema bundles while using as few bundles as possible.",
    href: "/booking",
    linkLabel: "Open booking",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <section className="max-w-4xl">
        <p className="mb-5 font-mono text-sm font-semibold uppercase tracking-[0.24em] text-red-400">
          The final chapter is coming
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
          Your complete rewatch, ready before doomsday.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Organize every prerequisite movie, calculate the perfect viewing
          order, and reserve an exact seat bundle for your group.
        </p>
      </section>

      <section
        aria-label="Application views"
        className="mt-14 grid gap-4 md:grid-cols-3"
      >
        {views.map((view) => (
          <article
            key={view.href}
            className="group flex min-h-64 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-red-400/40 hover:bg-white/[0.07]"
          >
            <p className="font-mono text-sm uppercase tracking-[0.16em] text-zinc-400">
              {view.label}
            </p>
            <h2 className="mt-8 text-2xl font-semibold text-white">
              {view.title}
            </h2>
            <p className="mt-3 leading-7 text-zinc-400">{view.description}</p>
            <Link
              href={view.href}
              className="mt-auto pt-8 font-semibold text-red-300 underline-offset-4 transition hover:text-red-200 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300"
            >
              {view.linkLabel}
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
