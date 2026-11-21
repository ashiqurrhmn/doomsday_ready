"use client";

import { useState } from "react";

const initialForm = {
  title: "",
  releaseYear: String(new Date().getFullYear()),
  runtimeMinutes: "",
  prerequisiteIds: [],
  watched: false,
};

export default function MovieForm({ movies, isSaving, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function togglePrerequisite(movieId) {
    setForm((current) => {
      const selected = current.prerequisiteIds.includes(movieId);

      return {
        ...current,
        prerequisiteIds: selected
          ? current.prerequisiteIds.filter((id) => id !== movieId)
          : [...current.prerequisiteIds, movieId],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    const title = form.title.trim();
    const releaseYear = Number(form.releaseYear);
    const runtimeMinutes = Number(form.runtimeMinutes);

    if (!title) {
      setValidationError("Enter a movie title.");
      return;
    }

    if (!Number.isInteger(releaseYear) || releaseYear < 1) {
      setValidationError("Release year must be a positive whole number.");
      return;
    }

    if (
      !Number.isInteger(runtimeMinutes) ||
      runtimeMinutes < 1 ||
      runtimeMinutes > 300
    ) {
      setValidationError("Runtime must be a whole number from 1 to 300.");
      return;
    }

    const created = await onCreate({
      title,
      releaseYear,
      runtimeMinutes,
      prerequisiteIds: form.prerequisiteIds,
      watched: form.watched,
    });

    if (created) {
      setForm(initialForm);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_20px_50px_rgba(0,0,0,0.45)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Add to the timeline
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">New Movie</h2>
          <p className="mt-1.5 text-sm leading-6 text-zinc-300/85">
            Register a chapter and optionally link what viewers must watch
            first.
          </p>
        </div>

        <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
          +
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            Title
          </span>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={updateField}
            placeholder="Avengers: Secret Wars"
            autoComplete="off"
            required
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/45 focus:bg-black/60"
          />
        </label>

        <label>
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            Release Year
          </span>
          <input
            name="releaseYear"
            type="number"
            min="1"
            step="1"
            value={form.releaseYear}
            onChange={updateField}
            required
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/45 focus:bg-black/60"
          />
        </label>

        <label>
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            Runtime (1–300m)
          </span>
          <input
            name="runtimeMinutes"
            type="number"
            min="1"
            max="300"
            step="1"
            value={form.runtimeMinutes}
            onChange={updateField}
            placeholder="165"
            required
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/45 focus:bg-black/60"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <div className="flex items-center justify-between gap-2">
          <legend className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            Prerequisite Movies
          </legend>
          {form.prerequisiteIds.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({ ...current, prerequisiteIds: [] }))
              }
              className="font-mono text-[11px] text-sky-300 hover:text-white"
            >
              Clear ({form.prerequisiteIds.length})
            </button>
          ) : (
            <span className="font-mono text-[11px] text-zinc-500">
              Optional
            </span>
          )}
        </div>

        {movies.length === 0 ? (
          <p className="mt-2.5 rounded-2xl border border-dashed border-white/15 bg-black/25 p-4 text-xs text-zinc-400">
            Add this first movie, then future movies can depend on it.
          </p>
        ) : (
          <div className="poster-rail mt-2.5 grid max-h-52 gap-2 overflow-y-auto rounded-2xl border border-white/15 bg-black/35 p-3">
            {movies.map((movie) => {
              const isSelected = form.prerequisiteIds.includes(movie._id);

              return (
                <label
                  key={movie._id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                    isSelected
                      ? "border-white/40 bg-white/[0.15] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePrerequisite(movie._id)}
                      className="size-4 accent-emerald-400"
                    />
                    <span className="font-medium">{movie.title}</span>
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    {movie.releaseYear}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      <label className="mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/30 hover:bg-black/45">
        <span>I have already watched this movie</span>
        <input
          name="watched"
          type="checkbox"
          checked={form.watched}
          onChange={updateField}
          className="size-4 accent-emerald-400"
        />
      </label>

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
        disabled={isSaving}
        className="mt-6 w-full rounded-full border border-white/35 bg-white/[0.16] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_30px_rgba(0,0,0,0.4)] transition duration-200 hover:scale-[1.01] hover:border-white/55 hover:bg-white/[0.24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Adding Movie..." : "+ Add Movie to Timeline"}
      </button>
    </form>
  );
}
