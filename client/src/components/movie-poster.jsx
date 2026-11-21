import Image from "next/image";

import { getMovieArtwork } from "@/lib/movie-artwork";

export default function MoviePoster({
  movie,
  sizes = "200px",
  priority = false,
  showTitleOverlay = true,
  className = "",
}) {
  const artwork = getMovieArtwork(movie);
  const title = movie?.title || "Untitled Movie";

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${artwork.gradient} ${className}`}
    >
      {artwork.poster ? (
        <Image
          src={artwork.poster}
          alt={`${title} poster`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-center transition duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-3.5">
          <span className="w-fit rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-200">
            {movie?.releaseYear || "MCU"}
          </span>
          <div className="my-auto text-center">
            <span className="font-mono text-3xl font-bold tracking-widest text-white/25">
              {title
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <span className="block h-1 w-10 rounded-full bg-white/25" />
        </div>
      )}

      {/* Subtle inner theatrical poster frame */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />

      {showTitleOverlay ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            {artwork.eyebrow ? (
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-300/90">
                {artwork.eyebrow}
              </p>
            ) : null}
            <p className="mt-0.5 text-xs font-black uppercase leading-[1.12] tracking-[0.05em] text-white drop-shadow sm:text-[13px]">
              {artwork.displayTitle}
            </p>
            {movie?.releaseYear ? (
              <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-zinc-400">
                {movie.releaseYear}
                {movie.runtimeMinutes ? ` · ${movie.runtimeMinutes}m` : ""}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
