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

function formatTotalRuntime(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) {
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

export default function MoviesView() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("year");

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

  const stats = useMemo(() => {
    const total = movies.length;
    const watched = movies.filter((movie) => movie.watched).length;
    const runtime = movies.reduce(
      (sum, movie) => sum + movie.runtimeMinutes,
      0,
    );
    const percent = total === 0 ? 0 : Math.round((watched / total) * 100);

    return {
      total,
      watched,
      unwatched: total - watched,
      runtime,
      percent,
    };
  }, [movies]);

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...movies]
      .filter((movie) => {
        if (filterStatus === "watched" && !movie.watched) {
          return false;
        }
        if (filterStatus === "unwatched" && movie.watched) {
          return false;
        }
        if (!query) {
          return true;
        }

        return (
          movie.title.toLowerCase().includes(query) ||
          String(movie.releaseYear).includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "year") {
          if (a.releaseYear !== b.releaseYear) {
            return a.releaseYear - b.releaseYear;
          }
        }
        return a.title.localeCompare(b.title);
      });
  }, [movies, searchQuery, filterStatus, sortBy]);

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
    <div className="relative isolate min-h-screen overflow-hidden bg-[#06070b]">
      {/* Atmospheric Top Widescreen Backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/heroes/the-avengers.jpg?v=8"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-center opacity-30 blur-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070b]/50 via-[#06070b]/85 to-[#06070b]" />
      </div>

      <div className="mx-auto w-full max-w-[1380px] px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-14">
        {/* Top Hero Header & Glass Stat Cards */}
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]">
              <span className="size-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
              Movie Library
            </span>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.03em] text-white drop-shadow sm:text-5xl lg:text-6xl">
              Build The Timeline
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-300 sm:text-lg">
              Curate every MCU chapter, link prerequisite storylines with
              automatic cycle protection, and track what you have watched.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3 sm:min-w-[440px]">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.35)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Movies
              </dt>
              <dd className="mt-1.5 text-2xl font-black text-white sm:text-3xl">
                {stats.total}
              </dd>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                In timeline
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.35)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Watched
              </dt>
              <dd className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-300 sm:text-3xl">
                  {stats.watched}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  ({stats.percent}%)
                </span>
              </dd>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                {stats.unwatched} remaining
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.35)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Runtime
              </dt>
              <dd className="mt-1.5 text-2xl font-black text-white sm:text-3xl">
                {formatTotalRuntime(stats.runtime)}
              </dd>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                {stats.runtime} min total
              </p>
            </div>
          </dl>
        </header>

        {/* Feedback Banners */}
        {errorMessage ? (
          <div
            role="alert"
            className="mt-8 flex items-start justify-between gap-4 rounded-2xl border border-rose-400/35 bg-rose-950/35 px-5 py-4 text-rose-100 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
          >
            <div>
              <p className="font-bold text-white">
                The request could not be completed.
              </p>
              <p className="mt-1 text-sm text-rose-200/90">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {notice ? (
          <div
            role="status"
            className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/25 px-5 py-4 text-emerald-100 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
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

        {/* Main Two-Column Studio Workspace */}
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div className="lg:sticky lg:top-24">
            <MovieForm
              movies={movies}
              isSaving={busyAction === "create"}
              onCreate={createMovie}
            />
          </div>

          <section aria-labelledby="movie-list-title">
            {/* Modern Glass Filter & Search Bar */}
            <div className="mb-6 rounded-3xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_14px_34px_rgba(0,0,0,0.4)] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                    Current Collection
                  </p>
                  <h2
                    id="movie-list-title"
                    className="mt-1 text-2xl font-bold text-white"
                  >
                    All Movies
                  </h2>
                </div>

                {/* Filter Status Pills */}
                <div
                  role="group"
                  aria-label="Filter movies by watched status"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {[
                    { id: "all", label: `All (${stats.total})` },
                    { id: "watched", label: `Watched (${stats.watched})` },
                    {
                      id: "unwatched",
                      label: `Remaining (${stats.unwatched})`,
                    },
                  ].map((tab) => {
                    const active = filterStatus === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilterStatus(tab.id)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
                          active
                            ? "border-white/35 bg-white/[0.18] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                            : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.10] hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Sort Row */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Filter by title or release year..."
                    aria-label="Filter movies by title or release year"
                    className="w-full rounded-2xl border border-white/15 bg-black/35 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-black/55"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="movie-sort-select"
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400"
                  >
                    Sort
                  </label>
                  <select
                    id="movie-sort-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-2xl border border-white/15 bg-zinc-950/80 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200 outline-none transition focus:border-white/40"
                  >
                    <option value="year">Release Year</option>
                    <option value="title">Title (A–Z)</option>
                  </select>
                </div>
              </div>
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
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white">
                  Your timeline is empty
                </h3>
                <p className="mt-2 text-zinc-400">
                  Use the glass panel on the left to add your first movie.
                </p>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white">
                  No matching movies found
                </h3>
                <p className="mt-2 text-zinc-400">
                  Try clearing your search or switching the watched filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="mt-5 rounded-full border border-white/25 bg-white/[0.12] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/[0.2]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredMovies.map((movie) => (
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
    </div>
  );
}
