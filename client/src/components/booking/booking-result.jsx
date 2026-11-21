export default function BookingResult({ quote, cinema }) {
  const availableBundles = cinema
    ? [...cinema.bundleSizes].sort((a, b) => a - b).join(", ")
    : "";

  if (!quote.possible) {
    return (
      <section
        role="status"
        aria-labelledby="booking-result-title"
        className="relative overflow-hidden rounded-3xl border border-amber-400/35 bg-amber-950/20 p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_20px_50px_rgba(0,0,0,0.48)] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber-500/20 blur-3xl"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            Booking Quote Result
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-100">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Not Possible
          </span>
        </div>

        <h2
          id="booking-result-title"
          className="relative mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
        >
          No Exact Bundle Combination Exists
        </h2>

        <p className="relative mt-4 leading-7 text-zinc-200">
          <span className="font-bold text-white">{quote.cinemaName}</span>{" "}
          cannot seat a group of{" "}
          <span className="font-bold text-white">{quote.groupSize}</span>{" "}
          exactly without leaving empty seats
          {availableBundles
            ? ` using its available bundles (${availableBundles})`
            : ""}
          .
        </p>

        <p className="relative mt-6 rounded-2xl border border-white/15 bg-black/35 px-4 py-3.5 text-sm text-zinc-300 backdrop-blur-xl">
          Try entering a different group size or choose another cinema venue
          with compatible seat bundle sizes.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="booking-result-title"
      className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_20px_50px_rgba(0,0,0,0.48)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-emerald-500/20 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Optimal Opening-Night Pass
          </span>
          <h2
            id="booking-result-title"
            className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
          >
            {quote.cinemaName}
          </h2>
          {availableBundles ? (
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Available bundle tiers: {availableBundles} seats
            </p>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          Exact Match
        </span>
      </div>

      {/* 3 Glass Stat Pods */}
      <dl className="relative mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Group Size
          </dt>
          <dd className="mt-1.5 text-2xl font-black text-white sm:text-3xl">
            {quote.groupSize}
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            Total seats covered
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Minimum Bundles
          </dt>
          <dd className="mt-1.5 text-2xl font-black text-emerald-300 sm:text-3xl">
            {quote.totalBundles}
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            Fewest possible
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Empty Seats
          </dt>
          <dd className="mt-1.5 text-2xl font-black text-emerald-300 sm:text-3xl">
            0
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            No wasted tickets
          </p>
        </div>
      </dl>

      {/* Bundle Breakdown Cards */}
      <div className="relative mt-7">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
            Bundles To Purchase
          </p>
          <span className="font-mono text-xs text-zinc-400">
            {quote.bundles.length}{" "}
            {quote.bundles.length === 1 ? "bundle size" : "bundle sizes"}
          </span>
        </div>

        <ul className="mt-3.5 grid gap-3">
          {quote.bundles.map((bundle) => {
            const seatTotal = bundle.size * bundle.quantity;
            const sharePercent = Math.round(
              (seatTotal / quote.groupSize) * 100,
            );

            return (
              <li
                key={bundle.size}
                className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-black uppercase tracking-tight text-white">
                      {bundle.size}-Seat Bundle
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-300/85">
                      {bundle.size} seats × {bundle.quantity} = {seatTotal}{" "}
                      {seatTotal === 1 ? "seat" : "seats"} ({sharePercent}% of
                      group)
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 font-mono text-base font-black text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                    × {bundle.quantity}
                  </span>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                    style={{ width: `${sharePercent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative mt-6 border-t border-white/10 pt-5 text-sm text-zinc-300">
        Total:{" "}
        <span className="font-bold text-white">{quote.totalBundles}</span>{" "}
        {quote.totalBundles === 1 ? "bundle" : "bundles"} covering all{" "}
        <span className="font-bold text-white">{quote.groupSize}</span>{" "}
        {quote.groupSize === 1 ? "seat" : "seats"} with zero empty seats.
      </p>
    </section>
  );
}
