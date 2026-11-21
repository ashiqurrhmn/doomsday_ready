"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import MoviePoster from "@/components/movie-poster";
import { apiRequest } from "@/lib/api";
import { getMovieArtwork, HERO_BACKDROP_SRC } from "@/lib/movie-artwork";

const FALLBACK_MOVIES = [
  {
    _id: "seed-iron-man",
    title: "Iron Man",
    titleKey: "iron man",
    releaseYear: 2008,
    runtimeMinutes: 126,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-first-avenger",
    title: "Captain America: The First Avenger",
    titleKey: "captain america: the first avenger",
    releaseYear: 2011,
    runtimeMinutes: 124,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-avengers",
    title: "The Avengers",
    titleKey: "the avengers",
    releaseYear: 2012,
    runtimeMinutes: 143,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-civil-war",
    title: "Captain America: Civil War",
    titleKey: "captain america: civil war",
    releaseYear: 2016,
    runtimeMinutes: 147,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-ragnarok",
    title: "Thor: Ragnarok",
    titleKey: "thor: ragnarok",
    releaseYear: 2017,
    runtimeMinutes: 130,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-infinity-war",
    title: "Avengers: Infinity War",
    titleKey: "avengers: infinity war",
    releaseYear: 2018,
    runtimeMinutes: 149,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-endgame",
    title: "Avengers: Endgame",
    titleKey: "avengers: endgame",
    releaseYear: 2019,
    runtimeMinutes: 181,
    watched: false,
    prerequisiteIds: [],
  },
  {
    _id: "seed-doomsday",
    title: "Avengers: Doomsday",
    titleKey: "avengers: doomsday",
    releaseYear: 2026,
    runtimeMinutes: 180,
    watched: false,
    prerequisiteIds: [],
  },
];

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) {
    return "0m";
  }

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

function getDefaultFeaturedId(list) {
  const ironMan = list.find(
    (movie) =>
      (movie.titleKey || movie.title || "").trim().toLowerCase() === "iron man",
  );

  return ironMan?._id || list[0]?._id || "";
}

export default function HeroShowcase() {
  const [liveMovies, setLiveMovies] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      try {
        const data = await apiRequest("/movies", { signal: controller.signal });
        if (!controller.signal.aborted && Array.isArray(data)) {
          setLiveMovies(data);
        }
      } catch {
        // Fallback showcase stays active if API is unreachable
      }
    }

    loadMovies();

    return () => controller.abort();
  }, []);

  const displayMovies = useMemo(() => {
    const source =
      liveMovies && liveMovies.length > 0 ? liveMovies : FALLBACK_MOVIES;

    return [...source].sort((a, b) => {
      if (a.releaseYear !== b.releaseYear) {
        return a.releaseYear - b.releaseYear;
      }

      return a.title.localeCompare(b.title);
    });
  }, [liveMovies]);

  const effectiveSelectedId = useMemo(() => {
    if (selectedId && displayMovies.some((movie) => movie._id === selectedId)) {
      return selectedId;
    }

    return getDefaultFeaturedId(displayMovies);
  }, [displayMovies, selectedId]);

  const featuredIndex = useMemo(() => {
    const idx = displayMovies.findIndex(
      (movie) => movie._id === effectiveSelectedId,
    );
    return idx >= 0 ? idx : 0;
  }, [displayMovies, effectiveSelectedId]);

  const featuredMovie = displayMovies[featuredIndex] || displayMovies[0];
  const featuredArtwork = getMovieArtwork(featuredMovie);
  const heroSrc = featuredArtwork.hero || HERO_BACKDROP_SRC;

  const stats = useMemo(() => {
    const total = displayMovies.length;
    const watched = displayMovies.filter((movie) => movie.watched).length;
    const remainingMinutes = displayMovies
      .filter((movie) => !movie.watched)
      .reduce((sum, movie) => sum + (movie.runtimeMinutes || 0), 0);
    const readiness = total === 0 ? 0 : Math.round((watched / total) * 100);

    return { total, watched, remainingMinutes, readiness };
  }, [displayMovies]);

  const rewatchHref =
    liveMovies && featuredMovie?._id
      ? `/rewatch?target=${encodeURIComponent(featuredMovie._id)}`
      : "/rewatch";

  function selectRelativeMovie(delta) {
    if (displayMovies.length === 0) {
      return;
    }

    const nextIndex =
      (featuredIndex + delta + displayMovies.length) % displayMovies.length;
    setSelectedId(displayMovies[nextIndex]._id);
  }

  return (
    <div className="bg-[#06070b]">
      {/* Full-bleed Widescreen 16:9 Horizontal Hero Stage */}
      <section className="relative isolate flex min-h-screen w-full flex-col justify-between overflow-hidden">
        {/* Horizontal Hero Backdrop with Deep Cinematic Dark Shadows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#06070b]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={heroSrc}
            src={`${heroSrc}?v=8`}
            alt={`${featuredMovie?.title || "Iron Man"} horizontal hero`}
            className="h-full w-full object-cover object-center brightness-[0.78] contrast-[1.06] transition-all duration-500"
          />

          {/* All-around radial cinema vignette shadow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 58% 42%, rgba(6, 7, 11, 0.12) 22%, rgba(6, 7, 11, 0.68) 76%, rgba(6, 7, 11, 0.96) 100%)",
            }}
          />

          {/* Subtle top shade so top of hero artwork stays visible behind minimal navbar */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

          {/* Rich left-side dark shadow behind hero title & glass buttons */}
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#06070b]/95 via-[#06070b]/70 via-38% to-[#06070b]/20" />

          {/* Deep bottom shadow fade into vertical MY LIST poster shelf */}
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#06070b] via-[#06070b]/90 via-45% to-transparent" />
        </div>

        {/* Left-Aligned Hero Content & All-Glassmorphism Buttons */}
        <div className="mx-auto flex w-full max-w-[1380px] flex-1 flex-col justify-center px-5 pb-6 pt-28 sm:px-8 sm:pt-32 lg:px-12">
          <div className="max-w-xl lg:max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.09] px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              {featuredArtwork.badge}
            </span>

            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-[66px]">
              {featuredMovie?.title || "Iron Man"}
            </h1>

            {/* Streaming Metadata Line */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-sm text-zinc-200 sm:text-base">
              <span className="font-medium text-zinc-100">
                {featuredArtwork.tagline}
              </span>
              <span aria-hidden="true" className="text-zinc-500">
                •
              </span>
              <span className="font-bold text-emerald-400">
                {featuredMovie?.watched
                  ? "Watched"
                  : `${stats.readiness}% Marathon Ready`}
              </span>
              <span aria-hidden="true" className="text-zinc-500">
                •
              </span>
              <span className="font-mono font-semibold text-zinc-200">
                {featuredMovie?.releaseYear}
              </span>
              {featuredMovie?.runtimeMinutes ? (
                <>
                  <span aria-hidden="true" className="text-zinc-500">
                    •
                  </span>
                  <span className="font-mono text-zinc-300">
                    {formatDuration(featuredMovie.runtimeMinutes)}
                  </span>
                </>
              ) : null}
            </div>

            {/* ALL-GLASSMORPHISM Hero Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href={rewatchHref}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/35 bg-white/[0.15] px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_32px_rgba(0,0,0,0.42)] transition duration-200 hover:scale-[1.02] hover:border-white/55 hover:bg-white/[0.23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-sm"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M8 5.14v14l11-7-11-7Z" />
                </svg>
                Rewatch Plan
              </Link>

              <Link
                href="/movies"
                aria-label="Add or edit movies in your library"
                title="Add or edit movies"
                className="grid size-12 place-items-center rounded-full border border-white/30 bg-white/[0.11] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_28px_rgba(0,0,0,0.38)] transition duration-200 hover:scale-105 hover:border-white/55 hover:bg-white/[0.22] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Link>

              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.10] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_10px_28px_rgba(0,0,0,0.38)] transition duration-200 hover:scale-[1.02] hover:border-white/50 hover:bg-white/[0.20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Book Watch Party
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Shelf: Vertical 2:3 Movie Poster Cards (Using /images/posters/*) */}
        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 pb-9 sm:px-8 lg:px-12">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white sm:text-base">
                My List
              </h2>
              <span className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-0.5 font-mono text-[11px] text-zinc-200 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                {stats.watched}/{stats.total} watched
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => selectRelativeMovie(-1)}
                  aria-label="Previous movie spotlight"
                  className="grid size-8 place-items-center rounded-full border border-white/25 bg-white/[0.10] text-white backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition hover:scale-105 hover:border-white/45 hover:bg-white/[0.20]"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => selectRelativeMovie(1)}
                  aria-label="Next movie spotlight"
                  className="grid size-8 place-items-center rounded-full border border-white/25 bg-white/[0.10] text-white backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition hover:scale-105 hover:border-white/45 hover:bg-white/[0.20]"
                >
                  ›
                </button>
              </div>

              <Link
                href="/movies"
                className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200 transition hover:text-white"
              >
                Manage all →
              </Link>
            </div>
          </div>

          <div className="poster-rail flex gap-3.5 overflow-x-auto pb-2 pt-1.5 lg:grid lg:grid-cols-8 lg:overflow-visible">
            {displayMovies.map((movie, index) => {
              const isSelected = movie._id === featuredMovie?._id;

              return (
                <button
                  key={movie._id}
                  type="button"
                  onClick={() => setSelectedId(movie._id)}
                  aria-pressed={isSelected}
                  className={`group relative aspect-[2/3] w-[144px] shrink-0 overflow-hidden rounded-xl border text-left transition duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-[158px] lg:w-auto ${
                    isSelected
                      ? "-translate-y-2 border-white/75 shadow-[0_16px_38px_rgba(0,0,0,0.88)] ring-2 ring-white/55"
                      : "border-white/20 hover:-translate-y-1.5 hover:border-white/55 hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
                  }`}
                >
                  <MoviePoster
                    movie={movie}
                    sizes="(min-width: 1024px) 13vw, 160px"
                    priority={index < 4}
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

                  {isSelected ? (
                    <span className="absolute left-2 top-2 rounded-full border border-white/40 bg-white/[0.22] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl shadow">
                      Active
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact Command Strip Below the Fold */}
      <section
        aria-label="Doomsday Ready tools"
        className="mx-auto w-full max-w-[1380px] border-t border-white/10 px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/movies"
            className="group rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-300">
              01 · Movie Library
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">
              Manage Timeline & Prerequisites
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Add movies, link required earlier chapters with cycle protection,
              and tick off everything you have watched.
            </p>
            <p className="mt-5 font-mono text-xs text-zinc-200 group-hover:text-white">
              {stats.total} movies · {formatDuration(stats.remainingMinutes)}{" "}
              remaining →
            </p>
          </Link>

          <Link
            href={rewatchHref}
            className="group rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">
              02 · Rewatch Order
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">
              Build the Exact Viewing Sequence
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Pick any target film to generate a topological prerequisite plan
              with progress tracking and remaining runtime.
            </p>
            <p className="mt-5 font-mono text-xs text-zinc-200 group-hover:text-emerald-300">
              Open Rewatch Planner →
            </p>
          </Link>

          <Link
            href="/booking"
            className="group rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">
              03 · Watch-Party Booking
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">
              Optimal Opening-Night Bundles
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Calculate the fewest exact cinema seat bundles for groups up to
              10,000 so nobody pays for an empty seat.
            </p>
            <p className="mt-5 font-mono text-xs text-zinc-200 group-hover:text-amber-300">
              Calculate Seat Bundles →
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
