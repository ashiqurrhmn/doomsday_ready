"use client";

import Link from "next/link";
import { useState } from "react";

import MoviePoster from "@/components/movie-poster";
import { getMovieArtwork } from "@/lib/movie-artwork";

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

export default function MovieCard({
  movie,
  allMovies,
  busyAction,
  onToggleWatched,
  onSavePrerequisites,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() =>
    movie.prerequisiteIds.map((prerequisite) => prerequisite._id),
  );

  const artwork = getMovieArtwork(movie);
  const otherMovies = allMovies.filter((item) => item._id !== movie._id);
  const isUpdatingWatched = busyAction === `${movie._id}:watched`;
  const isUpdatingPrerequisites = busyAction === `${movie._id}:prerequisites`;

  function openEditor() {
    setSelectedIds(
      movie.prerequisiteIds.map((prerequisite) => prerequisite._id),
    );
    setIsEditing(true);
  }

  function toggleSelection(movieId) {
    setSelectedIds((current) =>
      current.includes(movieId)
        ? current.filter((id) => id !== movieId)
        : [...current, movieId],
    );
  }

  async function savePrerequisites() {
    const saved = await onSavePrerequisites(movie._id, selectedIds);

    if (saved) {
      setIsEditing(false);
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_16px_40px_rgba(0,0,0,0.45)] transition duration-300 hover:border-white/30 hover:bg-white/[0.07] sm:p-6">
      {/* Subtle Movie-Matched Ambient Color Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full opacity-25 blur-3xl transition duration-500 group-hover:opacity-45"
        style={{ background: artwork.glow }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row">
        {/* Left Vertical 2:3 Movie Poster */}
        <div className="relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.7)] sm:w-32">
          <MoviePoster
            movie={movie}
            sizes="140px"
            showTitleOverlay={false}
            className="h-full w-full"
          />

          {movie.watched ? (
            <span
              title="Watched"
              className="absolute right-2 top-2 grid size-6 place-items-center rounded-full border border-emerald-300/60 bg-emerald-500/95 text-[11px] font-bold text-black shadow-md"
            >
              ✓
            </span>
          ) : null}
        </div>

        {/* Right Content & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-200">
                  {artwork.badge}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  {movie.releaseYear} · {formatRuntime(movie.runtimeMinutes)} (
                  {movie.runtimeMinutes}m)
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                {movie.title}
              </h3>

              <p className="mt-0.5 text-xs text-zinc-400">{artwork.tagline}</p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] backdrop-blur-xl ${
                movie.watched
                  ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  : "border-white/20 bg-white/[0.07] text-zinc-300"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  movie.watched
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-amber-400"
                }`}
              />
              {movie.watched ? "Watched" : "Unwatched"}
            </span>
          </div>

          {/* Prerequisites Chips */}
          <div className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
              Watch First ({movie.prerequisiteIds.length})
            </p>
            {movie.prerequisiteIds.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">
                Standalone entry — no earlier prerequisite movies required.
              </p>
            ) : (
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {movie.prerequisiteIds.map((prerequisite) => (
                  <li
                    key={prerequisite._id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md"
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        prerequisite.watched ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    />
                    {prerequisite.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Inline Glassmorphism Prerequisite Editor */}
      {isEditing ? (
        <div className="relative mt-6 rounded-2xl border border-white/20 bg-black/45 p-5 backdrop-blur-2xl shadow-inner">
          <fieldset>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <legend className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
                Edit Prerequisites for {movie.title}
              </legend>
              <span className="font-mono text-xs text-zinc-400">
                {selectedIds.length} selected
              </span>
            </div>

            {otherMovies.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">
                Add another movie before creating a dependency.
              </p>
            ) : (
              <div className="poster-rail mt-3.5 grid max-h-52 gap-2 overflow-y-auto sm:grid-cols-2">
                {otherMovies.map((option) => {
                  const isChecked = selectedIds.includes(option._id);

                  return (
                    <label
                      key={option._id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                        isChecked
                          ? "border-white/40 bg-white/[0.16] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                          : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelection(option._id)}
                          className="size-4 accent-emerald-400"
                        />
                        <span className="font-medium">{option.title}</span>
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        {option.releaseYear}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={savePrerequisites}
              disabled={isUpdatingPrerequisites}
              className="rounded-full border border-white/35 bg-white/[0.18] px-5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition hover:border-white/55 hover:bg-white/[0.26] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingPrerequisites ? "Saving..." : "Save Prerequisites"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isUpdatingPrerequisites}
              className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-300 transition hover:border-white/30 hover:bg-white/[0.12] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* Card Footer Glass Actions */}
      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onToggleWatched(movie)}
            disabled={isUpdatingWatched}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-xl transition focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 ${
              movie.watched
                ? "border-white/20 bg-white/[0.07] text-zinc-200 hover:border-white/40 hover:bg-white/[0.14]"
                : "border-emerald-400/35 bg-emerald-500/15 text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:border-emerald-300/60 hover:bg-emerald-500/25"
            }`}
          >
            {isUpdatingWatched
              ? "Updating..."
              : movie.watched
                ? "Mark Unwatched"
                : "✓ Mark Watched"}
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={openEditor}
              className="rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-200 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:border-white/40 hover:bg-white/[0.15] hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              Edit Prerequisites
            </button>
          ) : null}
        </div>

        <Link
          href={`/rewatch?target=${encodeURIComponent(movie._id)}`}
          className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 transition hover:text-white"
        >
          Rewatch Plan →
        </Link>
      </div>
    </article>
  );
}
