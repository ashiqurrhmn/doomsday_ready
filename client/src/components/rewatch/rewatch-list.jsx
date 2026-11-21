import MoviePoster from "@/components/movie-poster";
import { getMovieArtwork } from "@/lib/movie-artwork";

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

export default function RewatchList({ plan, busyMovieId, onToggleWatched }) {
  if (plan.totalMovies === 0) {
    return (
      <section
        aria-labelledby="rewatch-order-title"
        className="rounded-3xl border border-emerald-400/25 bg-emerald-950/20 p-10 text-center backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_18px_40px_rgba(0,0,0,0.4)]"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
          ✓ Ready for Premiere
        </span>
        <h3
          id="rewatch-order-title"
          className="mt-4 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl"
        >
          No Earlier Movies Required
        </h3>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-300">
          You do not need to watch any prerequisite movies before{" "}
          <span className="font-bold text-white">{plan.targetTitle}</span>. You
          can jump straight into the screening.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="rewatch-order-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
            Topological Viewing Sequence
          </p>
          <h3
            id="rewatch-order-title"
            className="mt-1.5 text-2xl font-black uppercase tracking-tight text-white"
          >
            Watch In This Exact Order
          </h3>
        </div>
        <span className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 font-mono text-xs text-zinc-300 backdrop-blur-xl">
          Target excluded · {plan.totalMovies}{" "}
          {plan.totalMovies === 1 ? "chapter" : "chapters"}
        </span>
      </div>

      <ol className="grid gap-3.5">
        {plan.movies.map((movie, index) => {
          const isUpdating = busyMovieId === movie._id;
          const artwork = getMovieArtwork(movie);
          const stepNumber = String(index + 1).padStart(2, "0");

          return (
            <li
              key={movie._id}
              className={`group relative overflow-hidden rounded-3xl border p-5 backdrop-blur-2xl transition duration-300 sm:p-6 ${
                movie.watched
                  ? "border-emerald-400/30 bg-emerald-950/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_14px_34px_rgba(0,0,0,0.4)]"
                  : "border-white/15 bg-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_14px_34px_rgba(0,0,0,0.4)] hover:border-white/30 hover:bg-white/[0.08]"
              }`}
            >
              {/* Subtle Ambient Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                style={{ background: artwork.glow }}
              />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`grid size-11 shrink-0 place-items-center rounded-2xl border font-mono text-sm font-black backdrop-blur-xl ${
                      movie.watched
                        ? "border-emerald-400/45 bg-emerald-500/20 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                        : "border-white/20 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                    }`}
                  >
                    {movie.watched ? "✓" : stepNumber}
                  </span>

                  <div className="relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-lg sm:w-20">
                    <MoviePoster
                      movie={movie}
                      sizes="80px"
                      showTitleOverlay={false}
                      className="h-full w-full"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        Step {stepNumber}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
                          movie.watched
                            ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-200"
                            : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {movie.watched ? "Watched" : "Remaining"}
                      </span>
                    </div>

                    <h4 className="mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl">
                      {movie.title}
                    </h4>

                    <p className="mt-1 font-mono text-xs text-zinc-300/85">
                      {movie.releaseYear} ·{" "}
                      {formatMovieDuration(movie.runtimeMinutes)} (
                      {movie.runtimeMinutes} min)
                    </p>
                  </div>
                </div>

                {/* Glassmorphism Watched Toggle Pill */}
                <label
                  className={`flex w-fit cursor-pointer items-center gap-3 rounded-full border px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] backdrop-blur-2xl transition ${
                    movie.watched
                      ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-emerald-500/25"
                      : "border-white/25 bg-white/[0.10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:border-white/45 hover:bg-white/[0.18]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(movie.watched)}
                    disabled={isUpdating}
                    onChange={() => onToggleWatched(movie)}
                    className="size-4 accent-emerald-400 disabled:cursor-not-allowed"
                  />
                  <span>
                    {isUpdating
                      ? "Updating..."
                      : movie.watched
                        ? "Watched"
                        : "Mark Watched"}
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
