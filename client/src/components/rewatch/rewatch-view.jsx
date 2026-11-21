"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "@/lib/api";
import RewatchList from "./rewatch-list";
import RewatchSummary from "./rewatch-summary";

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

export default function RewatchView() {
  const [movies, setMovies] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [moviesError, setMoviesError] = useState("");

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [plan, setPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState("");

  const [busyMovieId, setBusyMovieId] = useState("");
  const [notice, setNotice] = useState("");

  const planAbortRef = useRef(null);
  const activeTargetIdRef = useRef("");

  const fetchMovies = useCallback(async (signal) => {
    const data = await apiRequest("/movies", { signal });
    setMovies(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setMoviesError("");
        await fetchMovies(controller.signal);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMoviesError(getErrorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMovies(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
      planAbortRef.current?.abort();
    };
  }, [fetchMovies]);

  const fetchRewatchPlan = useCallback(async (targetId, options = {}) => {
    const { preserveCurrentPlan = false } = options;

    planAbortRef.current?.abort();

    if (!targetId) {
      activeTargetIdRef.current = "";
      setPlan(null);
      setPlanError("");
      setIsLoadingPlan(false);
      return;
    }

    const controller = new AbortController();
    planAbortRef.current = controller;
    activeTargetIdRef.current = targetId;

    setPlanError("");
    if (!preserveCurrentPlan) {
      setPlan(null);
      setIsLoadingPlan(true);
    }

    try {
      const data = await apiRequest(`/movies/${targetId}/rewatch-order`, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted && activeTargetIdRef.current === targetId) {
        setPlan(data);
      }
    } catch (error) {
      if (error.name !== "AbortError" && activeTargetIdRef.current === targetId) {
        setPlan(null);
        setPlanError(getErrorMessage(error));
      }
    } finally {
      if (!controller.signal.aborted && activeTargetIdRef.current === targetId) {
        setIsLoadingPlan(false);
      }
    }
  }, []);

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie._id === selectedMovieId) || null,
    [movies, selectedMovieId],
  );

  function handleTargetChange(event) {
    const nextTargetId = event.target.value;
    setSelectedMovieId(nextTargetId);
    setNotice("");
    void fetchRewatchPlan(nextTargetId);
  }

  async function handleRetryMovies() {
    setIsLoadingMovies(true);
    setMoviesError("");

    try {
      await fetchMovies();
    } catch (error) {
      setMoviesError(getErrorMessage(error));
    } finally {
      setIsLoadingMovies(false);
    }
  }

  async function handleToggleWatched(movie) {
    const currentTargetId = activeTargetIdRef.current;

    try {
      setBusyMovieId(movie._id);
      setPlanError("");
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

      if (currentTargetId && activeTargetIdRef.current === currentTargetId) {
        await fetchRewatchPlan(currentTargetId, { preserveCurrentPlan: true });
      }

      setNotice(
        `${movie.title} is now marked as ${updatedMovie.watched ? "watched" : "not watched"}.`,
      );
    } catch (error) {
      setPlanError(getErrorMessage(error));
    } finally {
      setBusyMovieId("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
          Rewatch planner
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Plan the rewatch order
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">
          Pick a target movie to see every prerequisite you need to watch first,
          track your progress, and check how much watch time remains.
        </p>
      </header>

      {moviesError ? (
        <div
          role="alert"
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-red-200"
        >
          <div>
            <p className="font-semibold">Could not load the movie library.</p>
            <p className="mt-1 text-sm text-red-200/80">{moviesError}</p>
          </div>
          <button
            type="button"
            onClick={handleRetryMovies}
            className="rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/30"
          >
            Try again
          </button>
        </div>
      ) : null}

      {isLoadingMovies ? (
        <div
          className="mt-10 grid gap-6"
          aria-label="Loading movies for rewatch planner"
        >
          <div className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
        </div>
      ) : movies.length === 0 && !moviesError ? (
        <section className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            No movies in your library yet
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Add movies and set their prerequisites first, then return here to
            generate a rewatch plan.
          </p>
          <Link
            href="/movies"
            className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            Go to Movies
          </Link>
        </section>
      ) : movies.length > 0 ? (
        <div className="mt-10 grid gap-8">
          <section
            aria-label="Choose target movie"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="target-movie-select"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Target movie
                </label>
                <select
                  id="target-movie-select"
                  value={selectedMovieId}
                  onChange={handleTargetChange}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                >
                  <option value="">Choose a movie to prepare for...</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title} ({movie.releaseYear})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMovieId ? (
                <button
                  type="button"
                  onClick={() => void fetchRewatchPlan(selectedMovieId)}
                  disabled={isLoadingPlan}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.1] focus-visible:outline-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingPlan ? "Loading..." : "Refresh plan"}
                </button>
              ) : null}
            </div>
          </section>

          {planError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-red-200"
            >
              <p className="font-semibold">Could not load the rewatch plan.</p>
              <p className="mt-1 text-sm text-red-200/80">{planError}</p>
            </div>
          ) : null}

          {notice ? (
            <p
              role="status"
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 px-5 py-4 text-emerald-200"
            >
              {notice}
            </p>
          ) : null}

          {isLoadingPlan ? (
            <div className="grid gap-4" aria-label="Loading rewatch plan">
              <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
              <div className="h-24 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
              <div className="h-24 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
            </div>
          ) : plan ? (
            <div className="grid gap-8">
              <RewatchSummary plan={plan} targetMovie={selectedMovie} />
              <RewatchList
                plan={plan}
                busyMovieId={busyMovieId}
                onToggleWatched={handleToggleWatched}
              />
            </div>
          ) : !planError ? (
            <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                Select a target movie above
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-zinc-400">
                Choose any movie from your timeline to see its complete
                prerequisite order, progress bar, and remaining watch time.
              </p>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
