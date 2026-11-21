"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import MovieCard from "./movie-card";
import MovieForm from "./movie-form";

function getErrorMessage(error) {
  if (error.code === "CIRCULAR_DEPENDENCY") {
    return `Circular dependency blocked. ${error.message}`;
  }

  return error.message || "Something went wrong. Please try again.";
}

export default function MoviesView() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  const loadMovies = useCallback(async (signal) => {
    const data = await apiRequest("/movies", { signal });
    setMovies(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setErrorMessage("");
        await loadMovies(controller.signal);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [loadMovies]);

  const stats = useMemo(
    () => ({
      total: movies.length,
      watched: movies.filter((movie) => movie.watched).length,
      runtime: movies.reduce(
        (total, movie) => total + movie.runtimeMinutes,
        0,
      ),
    }),
    [movies],
  );

  async function createMovie(movieData) {
    try {
      setBusyAction("create");
      setErrorMessage("");
      setNotice("");

      await apiRequest("/movies", {
        method: "POST",
        body: JSON.stringify(movieData),
      });
      await loadMovies();
      setNotice(`${movieData.title} was added to the movie library.`);
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return false;
    } finally {
      setBusyAction("");
    }
  }

  async function toggleWatched(movie) {
    try {
      setBusyAction(`${movie._id}:watched`);
      setErrorMessage("");
      setNotice("");

      const updatedMovie = await apiRequest(`/movies/${movie._id}`, {
        method: "PATCH",
        body: JSON.stringify({ watched: !movie.watched }),
      });

      setMovies((current) =>
        current.map((item) =>
          item._id === updatedMovie._id ? updatedMovie : item,
        ),
      );
      setNotice(
        `${movie.title} is now ${updatedMovie.watched ? "watched" : "not watched"}.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function savePrerequisites(movieId, prerequisiteIds) {
    try {
      setBusyAction(`${movieId}:prerequisites`);
      setErrorMessage("");
      setNotice("");

      const updatedMovie = await apiRequest(`/movies/${movieId}`, {
        method: "PATCH",
        body: JSON.stringify({ prerequisiteIds }),
      });

      setMovies((current) =>
        current.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie,
        ),
      );
      setNotice(`${updatedMovie.title}'s prerequisites were updated.`);
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return false;
    } finally {
      setBusyAction("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Movie library
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Build the timeline
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-300">
            Add every movie, connect what must be watched first, and keep your
            progress up to date.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-2 sm:min-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <dt className="text-sm text-zinc-500">Movies</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">
              {stats.total}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <dt className="text-sm text-zinc-500">Watched</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">
              {stats.watched}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <dt className="text-sm text-zinc-500">Minutes</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">
              {stats.runtime}
            </dd>
          </div>
        </dl>
      </header>

      {errorMessage ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-red-200"
        >
          <p className="font-semibold">The request could not be completed.</p>
          <p className="mt-1 text-sm text-red-200/80">{errorMessage}</p>
        </div>
      ) : null}

      {notice ? (
        <p
          role="status"
          className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 px-5 py-4 text-emerald-200"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="lg:sticky lg:top-28">
          <MovieForm
            movies={movies}
            isSaving={busyAction === "create"}
            onCreate={createMovie}
          />
        </div>

        <section aria-labelledby="movie-list-title">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.16em] text-zinc-500">
                Current collection
              </p>
              <h2 id="movie-list-title" className="mt-2 text-2xl font-semibold text-white">
                All movies
              </h2>
            </div>
            {!isLoading ? (
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-400">
                {movies.length} {movies.length === 1 ? "movie" : "movies"}
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-4" aria-label="Loading movies">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
              <h3 className="text-xl font-semibold text-white">
                Your timeline is empty
              </h3>
              <p className="mt-2 text-zinc-400">
                Use the form to add the first movie.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  allMovies={movies}
                  busyAction={busyAction}
                  onToggleWatched={toggleWatched}
                  onSavePrerequisites={savePrerequisites}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
