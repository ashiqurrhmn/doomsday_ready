function formatMovieDuration(runtimeMinutes) {
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export default function RewatchList({
  plan,
  busyMovieId,
  onToggleWatched,
}) {
  if (plan.totalMovies === 0) {
    return (
      <section
        aria-labelledby="rewatch-order-title"
        className="rounded-3xl border border-emerald-400/20 bg-emerald-950/15 p-8 text-center"
      >
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-emerald-300">
          No prerequisites
        </p>
        <h3
          id="rewatch-order-title"
          className="mt-3 text-2xl font-semibold text-white"
        >
          No earlier movies are required
        </h3>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-300">
          You do not need to watch any prerequisite movies before{" "}
          <span className="font-semibold text-white">{plan.targetTitle}</span>.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="rewatch-order-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-zinc-500">
            Viewing sequence
          </p>
          <h3
            id="rewatch-order-title"
            className="mt-2 text-2xl font-semibold text-white"
          >
            Watch in this order
          </h3>
        </div>
        <p className="text-sm text-zinc-400">
          Target movie excluded · {plan.totalMovies}{" "}
          {plan.totalMovies === 1 ? "step" : "steps"}
        </p>
      </div>

      <ol className="grid gap-3">
        {plan.movies.map((movie, index) => {
          const isUpdating = busyMovieId === movie._id;

          return (
            <li
              key={movie._id}
              className={`rounded-3xl border p-5 transition sm:p-6 ${
                movie.watched
                  ? "border-emerald-400/25 bg-emerald-950/15"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className={`grid size-10 shrink-0 place-items-center rounded-xl border font-mono text-sm font-bold ${
                      movie.watched
                        ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                        : "border-white/15 bg-black/30 text-zinc-200"
                    }`}
                  >
                    {movie.watched ? "✓" : index + 1}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Step {index + 1}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          movie.watched
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                            : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {movie.watched ? "Watched" : "Remaining"}
                      </span>
                    </div>

                    <h4 className="mt-1.5 text-xl font-semibold text-white">
                      {movie.title}
                    </h4>

                    <p className="mt-1 font-mono text-sm text-zinc-400">
                      {movie.releaseYear} · {movie.runtimeMinutes} min (
                      {formatMovieDuration(movie.runtimeMinutes)})
                    </p>
                  </div>
                </div>

                <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]">
                  <input
                    type="checkbox"
                    checked={Boolean(movie.watched)}
                    disabled={isUpdating}
                    onChange={() => onToggleWatched(movie)}
                    className="size-4 accent-emerald-500 disabled:cursor-not-allowed"
                  />
                  <span>
                    {isUpdating
                      ? "Updating..."
                      : movie.watched
                        ? "Watched"
                        : "Mark watched"}
                  </span>
                </label>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
