import MoviePoster from "@/components/movie-poster";
import { getMovieArtwork } from "@/lib/movie-artwork";

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
  const movieForArt = targetMovie || { title: plan.targetTitle };
  const artwork = getMovieArtwork(movieForArt);

  return (
    <section
      aria-labelledby="rewatch-summary-title"
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_20px_50px_rgba(0,0,0,0.48)] sm:p-8"
    >
      {/* Subtle Ambient Color Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full opacity-35 blur-3xl"
        style={{ background: artwork.glow }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Target Movie 2:3 Poster */}
        <div className="relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-[0_14px_34px_rgba(0,0,0,0.75)] sm:w-36">
          <MoviePoster
            movie={movieForArt}
            sizes="160px"
            showTitleOverlay={false}
            className="h-full w-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/[0.09] px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Target Movie
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-300">
                  {artwork.badge}
                </span>
              </div>

              <h2
                id="rewatch-summary-title"
                className="mt-2.5 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
              >
                {plan.targetTitle}
              </h2>

              <p className="mt-1 text-sm text-zinc-300/90">
                {artwork.tagline}
                {targetMovie
                  ? ` · ${targetMovie.releaseYear} · ${formatDuration(targetMovie.runtimeMinutes)} (${targetMovie.runtimeMinutes}m)`
                  : ""}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-xl ${
                isComplete
                  ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                  : "border-white/25 bg-white/[0.10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  isComplete
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-sky-400 shadow-[0_0_8px_#38bdf8]"
                }`}
              />
              {totalMovies === 0
                ? "Ready Immediately"
                : isComplete
                  ? "Rewatch Complete"
                  : `${remainingMovies} ${remainingMovies === 1 ? "Movie" : "Movies"} Left`}
            </span>
          </div>

          {/* Luminous Glass Progress Bar */}
          <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <p className="font-bold text-white">
                {totalMovies === 0
                  ? "0 of 0 prerequisites watched"
                  : `${watchedCount} of ${totalMovies} watched`}
              </p>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                {progressPercent}% Ready
              </p>
            </div>

            <div
              role="progressbar"
              aria-label="Rewatch progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              className="mt-2.5 h-3.5 w-full overflow-hidden rounded-full border border-white/15 bg-black/50 p-0.5 shadow-inner"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_16px_rgba(52,211,153,0.65)]"
                    : "bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Glass Stat Pods */}
      <dl className="relative mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Prerequisites
          </dt>
          <dd className="mt-1.5 text-2xl font-black text-white sm:text-3xl">
            {totalMovies}
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            Target movie excluded
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Watched Progress
          </dt>
          <dd className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-300 sm:text-3xl">
              {watchedCount}
            </span>
            <span className="font-mono text-xs text-zinc-400">
              / {totalMovies} completed
            </span>
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            {remainingMovies} unwatched
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Remaining Watch Time
          </dt>
          <dd className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-black text-white sm:text-3xl">
              {formatDuration(remainingRuntimeMinutes)}
            </span>
            {remainingRuntimeMinutes > 0 ? (
              <span className="font-mono text-xs text-zinc-400">
                ({remainingRuntimeMinutes} min)
              </span>
            ) : null}
          </dd>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
            {remainingRuntimeMinutes === 0
              ? "All prerequisites complete"
              : "Unwatched prerequisites total"}
          </p>
        </div>
      </dl>
    </section>
  );
}
