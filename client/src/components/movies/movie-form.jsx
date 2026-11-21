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
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <div>
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
          Add to the timeline
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">New movie</h2>
        <p className="mt-2 leading-7 text-zinc-400">
          Add its basic details now. Prerequisites can be changed later.
        </p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-zinc-300">
            Title
          </span>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={updateField}
            placeholder="Avengers: Doomsday"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-zinc-300">
            Release year
          </span>
          <input
            name="releaseYear"
            type="number"
            min="1"
            step="1"
            value={form.releaseYear}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-zinc-300">
            Runtime in minutes
          </span>
          <input
            name="runtimeMinutes"
            type="number"
            min="1"
            max="300"
            step="1"
            value={form.runtimeMinutes}
            onChange={updateField}
            placeholder="180"
            required
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-zinc-300">
          Prerequisite movies
        </legend>
        {movies.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-500">
            Add this first movie, then future movies can depend on it.
          </p>
        ) : (
          <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3 sm:grid-cols-2">
            {movies.map((movie) => (
              <label
                key={movie._id}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
              >
                <input
                  type="checkbox"
                  checked={form.prerequisiteIds.includes(movie._id)}
                  onChange={() => togglePrerequisite(movie._id)}
                  className="mt-0.5 size-4 accent-red-500"
                />
                <span>
                  <span className="block font-medium text-zinc-200">
                    {movie.title}
                  </span>
                  <span className="text-zinc-500">{movie.releaseYear}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <label className="mt-6 flex w-fit cursor-pointer items-center gap-3 text-sm text-zinc-300">
        <input
          name="watched"
          type="checkbox"
          checked={form.watched}
          onChange={updateField}
          className="size-4 accent-red-500"
        />
        I have already watched this movie
      </label>

      {validationError ? (
        <p role="alert" className="mt-5 text-sm font-medium text-red-300">
          {validationError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-7 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Adding movie..." : "Add movie"}
      </button>
    </form>
  );
}
