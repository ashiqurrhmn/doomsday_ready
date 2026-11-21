"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "@/lib/api";
import { getMovieArtwork, HERO_BACKDROP_SRC } from "@/lib/movie-artwork";
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
      if (
        error.name !== "AbortError" &&
        activeTargetIdRef.current === targetId
      ) {
        setPlan(null);
        setPlanError(getErrorMessage(error));
      }
    } finally {
      if (!controller.signal.aborted && activeTargetIdRef.current === targetId) {
        setIsLoadingPlan(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setMoviesError("");
        const data = await apiRequest("/movies", { signal: controller.signal });
        if (controller.signal.aborted) {
          return;
        }

        setMovies(data);

        const initialTarget = new URLSearchParams(window.location.search).get(
          "target",
        );
        if (
          initialTarget &&
          data.some((movie) => movie._id === initialTarget)
        ) {
          setSelectedMovieId(initialTarget);
          void fetchRewatchPlan(initialTarget);
        }
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
  }, [fetchRewatchPlan]);

  const sortedMovies = useMemo(
    () =>
      [...movies].sort((a, b) => {
        if (a.releaseYear !== b.releaseYear) {
          return a.releaseYear - b.releaseYear;
        }
        return a.title.localeCompare(b.title);
      }),
    [movies],
  );

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie._id === selectedMovieId) || null,
    [movies, selectedMovieId],
  );

  const selectedArtwork = getMovieArtwork(selectedMovie);
  const backdropSrc = selectedMovie
    ? selectedArtwork.hero || HERO_BACKDROP_SRC
    : HERO_BACKDROP_SRC;

  function selectTargetMovie(nextTargetId) {
    setSelectedMovieId(nextTargetId);
    setNotice("");
    void fetchRewatchPlan(nextTargetId);
  }

  function handleTargetChange(event) {
    selectTargetMovie(event.target.value);
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[#06070b]">
      {/* Dynamic Target-Matched Widescreen Top Backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={backdropSrc}
          src={`${backdropSrc}?v=8`}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-center opacity-35 blur-xl transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070b]/45 via-[#06070b]/85 to-[#06070b]" />
      </div>

      <div className="mx-auto w-full max-w-[1380px] px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-14">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              Rewatch Planner
            </span>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.03em] text-white drop-shadow sm:text-5xl lg:text-6xl">
              Plan The Rewatch Order
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-300 sm:text-lg">
              Choose any target movie to compute every required earlier chapter
              in topological viewing order, track watched progress, and check
              remaining marathon time.
            </p>
          </div>

          <Link
            href="/movies"
            className="w-fit rounded-full border border-white/20 bg-white/[0.08] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-100 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition hover:border-white/40 hover:bg-white/[0.16] hover:text-white"
          >
            Manage Movies Library →
          </Link>
        </header>

        {moviesError ? (
          <div
            role="alert"
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-400/35 bg-rose-950/35 px-5 py-4 text-rose-100 backdrop-blur-2xl"
          >
            <div>
              <p className="font-bold text-white">
                Could not load the movie library.
              </p>
              <p className="mt-1 text-sm text-rose-200/85">{moviesError}</p>
            </div>
            <button
              type="button"
              onClick={handleRetryMovies}
              className="rounded-full border border-white/25 bg-white/[0.14] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/[0.22]"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {isLoadingMovies ? (
          <div
            className="mt-10 grid gap-6"
            aria-label="Loading movies for rewatch planner"
          >
            <div className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
            <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          </div>
        ) : movies.length === 0 && !moviesError ? (
          <section className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              No movies in your library yet
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">
              Add movies and set their prerequisites first, then return here to
              generate a topological rewatch plan.
            </p>
            <Link
              href="/movies"
              className="mt-6 inline-block rounded-full border border-white/35 bg-white/[0.16] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] transition hover:bg-white/[0.24]"
            >
              Go to Movies
            </Link>
          </section>
        ) : movies.length > 0 ? (
          <div className="mt-10 grid gap-8">
            {/* Glassmorphism Target Picker Panel */}
            <section
              aria-label="Choose target movie"
              className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_20px_50px_rgba(0,0,0,0.45)] sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="target-movie-select"
                    className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Target Movie
                  </label>
                  <select
                    id="target-movie-select"
                    value={selectedMovieId}
                    onChange={handleTargetChange}
                    className="w-full rounded-2xl border border-white/20 bg-zinc-950/85 px-4 py-3.5 text-sm font-medium text-white outline-none transition focus:border-white/50"
                  >
                    <option value="">Choose a movie to prepare for...</option>
                    {sortedMovies.map((movie) => (
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
                    className="rounded-full border border-white/25 bg-white/[0.12] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition hover:border-white/45 hover:bg-white/[0.20] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoadingPlan ? "Loading..." : "Refresh Plan"}
                  </button>
                ) : null}
              </div>

              {/* Quick-Select Movie Pills */}
              <div className="mt-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                  Quick Select Target
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {sortedMovies.map((movie) => {
                    const isSelected = movie._id === selectedMovieId;
                    return (
                      <button
                        key={movie._id}
                        type="button"
                        onClick={() => selectTargetMovie(movie._id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "border-white/50 bg-white/[0.22] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.3)]"
                            : "border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:bg-white/[0.10] hover:text-white"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            movie.watched ? "bg-emerald-400" : "bg-zinc-500"
                          }`}
                        />
                        <span>{movie.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {planError ? (
              <div
                role="alert"
                className="rounded-2xl border border-rose-400/35 bg-rose-950/35 px-5 py-4 text-rose-100 backdrop-blur-2xl"
              >
                <p className="font-bold text-white">
                  Could not load the rewatch plan.
                </p>
                <p className="mt-1 text-sm text-rose-200/85">{planError}</p>
              </div>
            ) : null}

            {notice ? (
              <div
                role="status"
                className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/25 px-5 py-4 text-emerald-100 backdrop-blur-2xl"
              >
                <p className="text-sm font-medium">{notice}</p>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            ) : null}

            {isLoadingPlan ? (
              <div className="grid gap-4" aria-label="Loading rewatch plan">
                <div className="h-60 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
                <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
                <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
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
              <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Ready to compute
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Select a target movie above
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-zinc-400">
                  Pick any movie from the dropdown or quick-select pills to see
                  its prerequisite viewing sequence, progress bar, and remaining
                  watch time.
                </p>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
