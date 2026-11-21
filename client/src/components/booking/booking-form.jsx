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
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <div>
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
          Watch-party quote
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Find exact bundles
        </h2>
        <p className="mt-2 leading-7 text-zinc-400">
          Pick a cinema and enter how many people are coming to get the fewest
          bundles with zero empty seats.
        </p>
      </div>

      <div className="mt-7 grid gap-5">
        <div>
          <label
            htmlFor="cinema-select"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Cinema
          </label>
          <select
            id="cinema-select"
            value={selectedCinemaId}
            onChange={(event) => onCinemaChange(event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
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
        </div>

        {selectedCinema ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Available bundle sizes at {selectedCinema.name}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sortedSelectedBundles.map((size) => (
                <li
                  key={size}
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 font-mono text-sm text-zinc-200"
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
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Group size
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
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Enter a whole number from 1 to 10,000.
          </p>
        </div>
      </div>

      {validationError ? (
        <p role="alert" className="mt-5 text-sm font-medium text-red-300">
          {validationError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Calculating..." : "Calculate bundles"}
      </button>
    </form>
  );
}
