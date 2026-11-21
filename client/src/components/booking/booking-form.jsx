const QUICK_GROUP_PRESETS = [6, 11, 44, 7];

export default function BookingForm({
  cinemas,
  selectedCinemaId,
  selectedCinema,
  groupSize,
  validationError,
  isSubmitting,
  onCinemaChange,
  onGroupSizeChange,
  onSubmit,
}) {
  const sortedSelectedBundles = selectedCinema
    ? [...selectedCinema.bundleSizes].sort((a, b) => a - b)
    : [];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_20px_50px_rgba(0,0,0,0.45)] sm:p-8"
    >
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
          Watch-Party Quote
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Find Exact Seat Bundles
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-zinc-300/85">
          Pick a cinema and enter how many fans are attending to get the minimum
          bundles with zero empty seats.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <label
            htmlFor="cinema-select"
            className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-zinc-300"
          >
            Cinema Venue
          </label>
          <select
            id="cinema-select"
            value={selectedCinemaId}
            onChange={(event) => onCinemaChange(event.target.value)}
            required
            className="w-full rounded-2xl border border-white/20 bg-zinc-950/85 px-4 py-3.5 text-sm font-medium text-white outline-none transition focus:border-white/50"
          >
            <option value="">Choose a cinema...</option>
            {cinemas.map((cinema) => {
              const sizes = [...cinema.bundleSizes]
                .sort((a, b) => a - b)
                .join(", ");

              return (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name} (bundles: {sizes})
                </option>
              );
            })}
          </select>

          {/* Interactive Cinema Quick-Pick Cards */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {cinemas.map((cinema) => {
              const isSelected = cinema._id === selectedCinemaId;
              const sizes = [...cinema.bundleSizes]
                .sort((a, b) => a - b)
                .join(", ");

              return (
                <button
                  key={cinema._id}
                  type="button"
                  onClick={() => onCinemaChange(cinema._id)}
                  className={`flex flex-col items-start rounded-2xl border px-3.5 py-2.5 text-left transition ${
                    isSelected
                      ? "border-white/45 bg-white/[0.18] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      : "border-white/10 bg-black/30 text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold">{cinema.name}</span>
                  <span className="mt-0.5 font-mono text-[11px] text-zinc-400">
                    Bundles: {sizes}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedCinema ? (
          <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
              Seat Bundles Sold at {selectedCinema.name}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {sortedSelectedBundles.map((size) => (
                <li
                  key={size}
                  className="rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1 font-mono text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                >
                  {size} {size === 1 ? "seat" : "seats"}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="group-size-input"
            className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-zinc-300"
          >
            Group Size (1–10,000)
          </label>
          <input
            id="group-size-input"
            name="groupSize"
            type="number"
            min="1"
            max="10000"
            step="1"
            inputMode="numeric"
            value={groupSize}
            onChange={(event) => onGroupSizeChange(event.target.value)}
            placeholder="e.g. 6"
            required
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/45 focus:bg-black/60"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] text-zinc-400">
              Quick group sizes:
            </span>
            {QUICK_GROUP_PRESETS.map((preset) => {
              const active = groupSize === String(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onGroupSizeChange(String(preset))}
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-bold transition ${
                    active
                      ? "border-white/45 bg-white/[0.20] text-white"
                      : "border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:bg-white/[0.10] hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {validationError ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-400/30 bg-rose-950/35 px-3.5 py-2.5 text-xs font-medium text-rose-200"
        >
          {validationError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full border border-white/35 bg-white/[0.16] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_30px_rgba(0,0,0,0.4)] transition duration-200 hover:scale-[1.01] hover:border-white/55 hover:bg-white/[0.24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Calculating..." : "Calculate Optimal Bundles"}
      </button>
    </form>
  );
}
