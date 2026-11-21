function formatDuration(totalMinutes) {
  if (totalMinutes <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export default function RewatchSummary({ plan, targetMovie }) {
  const { totalMovies, watchedCount, remainingRuntimeMinutes } = plan;
  const remainingMovies = Math.max(totalMovies - watchedCount, 0);
  const progressPercent =
    totalMovies === 0 ? 100 : Math.round((watchedCount / totalMovies) * 100);
  const isComplete = totalMovies === 0 || watchedCount === totalMovies;

  return (
    <section
      aria-labelledby="rewatch-summary-title"
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
            Target movie
          </p>
          <h2
            id="rewatch-summary-title"
            className="mt-2 text-3xl font-semibold tracking-tight text-white"
          >
            {plan.targetTitle}
          </h2>
          {targetMovie ? (
            <p className="mt-2 font-mono text-sm text-zinc-400">
              {targetMovie.releaseYear} · {targetMovie.runtimeMinutes} min
              {targetMovie.watched ? " · Already watched" : ""}
            </p>
          ) : null}
        </div>

        <span
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
            isComplete
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {totalMovies === 0
            ? "Ready immediately"
            : isComplete
              ? "Rewatch complete"
              : `${remainingMovies} ${remainingMovies === 1 ? "movie" : "movies"} left`}
        </span>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <p className="font-medium text-zinc-200">
            {totalMovies === 0
              ? "0 of 0 prerequisites watched"
              : `${watchedCount} of ${totalMovies} watched`}
          </p>
          <p className="font-mono text-zinc-400">{progressPercent}%</p>
        </div>

        <div
          role="progressbar"
          aria-label="Rewatch progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-black/40"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isComplete ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Prerequisites</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {totalMovies}
          </dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Watched</dt>
          <dd className="mt-1 text-2xl font-semibold text-white">
            {watchedCount}
          </dd>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <dt className="text-sm text-zinc-400">Remaining watch time</dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {formatDuration(remainingRuntimeMinutes)}
            </span>
            {remainingRuntimeMinutes > 0 ? (
              <span className="font-mono text-xs text-zinc-500">
                ({remainingRuntimeMinutes} min)
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}
