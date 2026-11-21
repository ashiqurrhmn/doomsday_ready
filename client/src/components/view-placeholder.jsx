import Link from "next/link";

export default function ViewPlaceholder({ eyebrow, title, description }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <section className="max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-10">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
          {description}
        </p>
        <p className="mt-8 rounded-2xl border border-dashed border-white/15 bg-black/20 p-5 text-zinc-400">
          This view is scaffolded and ready for its feature implementation.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-red-300 underline-offset-4 hover:text-red-200 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300"
        >
          Back to overview
        </Link>
      </section>
    </div>
  );
}
