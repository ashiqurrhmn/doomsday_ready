"use client";

import { useState } from "react";

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
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.15em] text-zinc-500">
            {movie.releaseYear} · {movie.runtimeMinutes} min
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {movie.title}
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-sm font-medium ${
            movie.watched
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          }`}
        >
          {movie.watched ? "Watched" : "Not watched"}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-300">Prerequisites</p>
        {movie.prerequisiteIds.length === 0 ? (
          <p className="mt-2 text-zinc-500">No prerequisite movies.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {movie.prerequisiteIds.map((prerequisite) => (
              <li
                key={prerequisite._id}
                className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-zinc-300"
              >
                {prerequisite.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditing ? (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/10 p-4">
          <fieldset>
            <legend className="text-sm font-semibold text-zinc-200">
              Change prerequisites
            </legend>
            {otherMovies.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">
                Add another movie before creating a dependency.
              </p>
            ) : (
              <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                {otherMovies.map((option) => (
                  <label
                    key={option._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option._id)}
                      onChange={() => toggleSelection(option._id)}
                      className="size-4 accent-red-500"
                    />
                    <span>{option.title}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={savePrerequisites}
              disabled={isUpdatingPrerequisites}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingPrerequisites ? "Saving..." : "Save prerequisites"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isUpdatingPrerequisites}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={() => onToggleWatched(movie)}
          disabled={isUpdatingWatched}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdatingWatched
            ? "Updating..."
            : movie.watched
              ? "Mark as not watched"
              : "Mark as watched"}
        </button>
        {!isEditing ? (
          <button
            type="button"
            onClick={openEditor}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-red-300"
          >
            Edit prerequisites
          </button>
        ) : null}
      </div>
    </article>
  );
}
