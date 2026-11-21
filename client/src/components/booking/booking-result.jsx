export default function BookingResult({ quote, cinema }) {
  const availableBundles = cinema
    ? [...cinema.bundleSizes].sort((a, b) => a - b).join(", ")
    : "";

  if (!quote.possible) {
    return (
      <section
        role="status"
        aria-labelledby="booking-result-title"
        className="rounded-3xl border border-amber-400/30 bg-amber-950/20 p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Booking result
          </p>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200">
            Not possible
          </span>
        </div>

        <h2
          id="booking-result-title"
          className="mt-4 text-3xl font-semibold tracking-tight text-white"
        >
          No exact bundle combination exists
        </h2>

        <p className="mt-4 leading-7 text-zinc-300">
          <span className="font-semibold text-white">{quote.cinemaName}</span>{" "}
          cannot seat a group of{" "}
          <span className="font-semibold text-white">{quote.groupSize}</span>{" "}
          exactly without empty seats
          {availableBundles ? ` using bundles of ${availableBundles}` : ""}.
        </p>

        <p className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-400">
          Try a different group size or choose another cinema with different
          bundle sizes.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="booking-result-title"
      className="rounded-3xl border border-emerald-400/25 bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Optimal booking quote
          </p>
          <h2
            id="booking-result-title"
            className="mt-2 text-3xl font-semibold tracking-tight text-white"
          >
            {quote.cinemaName}
          </h2>
        </div>

        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-sm font-medium text-emerald-300">
          Exact match
        </span>
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Group size</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {quote.groupSize}
          </dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Minimum bundles</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {quote.totalBundles}
          </dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Empty seats</dt>
          <dd className="mt-1 text-2xl font-semibold text-emerald-300">0</dd>
        </div>
      </dl>

      <div className="mt-7">
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-zinc-400">
          Bundles to buy
        </p>

        <ul className="mt-4 grid gap-3">
          {quote.bundles.map((bundle) => {
            const seatTotal = bundle.size * bundle.quantity;

            return (
              <li
                key={bundle.size}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-5 py-4"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    {bundle.size}-seat bundle
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {bundle.size} × {bundle.quantity} = {seatTotal}{" "}
                    {seatTotal === 1 ? "seat" : "seats"}
                  </p>
                </div>

                <span className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 font-mono text-base font-semibold text-emerald-200">
                  × {bundle.quantity}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-6 border-t border-white/10 pt-5 text-sm text-zinc-400">
        Total: <span className="font-semibold text-white">{quote.totalBundles}</span>{" "}
        {quote.totalBundles === 1 ? "bundle" : "bundles"} covering all{" "}
        <span className="font-semibold text-white">{quote.groupSize}</span>{" "}
        {quote.groupSize === 1 ? "seat" : "seats"} with no wasted tickets.
      </p>
    </section>
  );
}
