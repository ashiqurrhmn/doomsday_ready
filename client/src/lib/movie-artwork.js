export const HERO_BACKDROP_SRC = "/images/heroes/doomsday.jpg";

const MOVIE_ARTWORK_BY_KEY = {
  "iron man": {
    poster: "/images/posters/iron-man.jpg",
    hero: "/images/heroes/iron-man.jpg",
    eyebrow: "Marvel Studios · 2008",
    displayTitle: "IRON MAN",
    tagline: "The Armor That Started It All",
    badge: "Origin Chapter",
    gradient: "from-red-950 via-amber-950/90 to-zinc-950",
    glow: "rgba(56, 189, 248, 0.22)",
  },
  "captain america: the first avenger": {
    poster: "/images/posters/first-avenger.jpg",
    hero: "/images/heroes/first-avenger.jpg",
    eyebrow: "Captain America · 2011",
    displayTitle: "THE FIRST AVENGER",
    tagline: "Super Soldier Chronicles · 1940s Archive",
    badge: "Origin Chapter",
    gradient: "from-sky-950 via-slate-900 to-zinc-950",
    glow: "rgba(56, 189, 248, 0.25)",
  },
  "the avengers": {
    poster: "/images/posters/the-avengers.jpg",
    hero: "/images/heroes/the-avengers.jpg",
    eyebrow: "Marvel Studios · 2012",
    displayTitle: "THE AVENGERS",
    tagline: "Earth's Mightiest Assembly · Phase One Finale",
    badge: "Ensemble Event",
    gradient: "from-blue-950 via-indigo-950/90 to-zinc-950",
    glow: "rgba(56, 189, 248, 0.26)",
  },
  "captain america: civil war": {
    poster: "/images/posters/civil-war.jpg",
    hero: "/images/heroes/civil-war.jpg",
    eyebrow: "Captain America · 2016",
    displayTitle: "CIVIL WAR",
    tagline: "Divided We Fall · Heroes Clash",
    badge: "Turning Point",
    gradient: "from-rose-950 via-slate-900 to-zinc-950",
    glow: "rgba(244, 63, 94, 0.26)",
  },
  "thor: ragnarok": {
    poster: "/images/posters/thor-ragnarok.jpg",
    hero: "/images/heroes/thor-ragnarok.jpg",
    eyebrow: "Thor · 2017",
    displayTitle: "RAGNAROK",
    tagline: "Cosmic Gladiator Arena · Neon Odyssey",
    badge: "Cosmic Chapter",
    gradient: "from-fuchsia-950 via-cyan-950/80 to-zinc-950",
    glow: "rgba(217, 70, 239, 0.26)",
  },
  "avengers: infinity war": {
    poster: "/images/posters/infinity-war.jpg",
    hero: "/images/heroes/infinity-war.jpg",
    eyebrow: "Avengers · 2018",
    displayTitle: "INFINITY WAR",
    tagline: "Six Stones · Destiny Arrives",
    badge: "Infinity Saga",
    gradient: "from-violet-950 via-purple-950/90 to-zinc-950",
    glow: "rgba(139, 92, 246, 0.28)",
  },
  "avengers: endgame": {
    poster: "/images/posters/endgame.jpg",
    hero: "/images/heroes/endgame.jpg",
    eyebrow: "Avengers · 2019",
    displayTitle: "ENDGAME",
    tagline: "Whatever It Takes · The Grand Finale",
    badge: "Infinity Finale",
    gradient: "from-amber-950 via-indigo-950/90 to-zinc-950",
    glow: "rgba(245, 158, 11, 0.26)",
  },
  "avengers: doomsday": {
    poster: "/images/posters/doomsday.jpg",
    hero: "/images/heroes/doomsday.jpg",
    eyebrow: "Avengers · 2026",
    displayTitle: "DOOMSDAY",
    tagline: "A Doomsday Ready Featured Premiere",
    badge: "Opening Night",
    gradient: "from-emerald-950 via-teal-950/90 to-zinc-950",
    glow: "rgba(16, 185, 129, 0.28)",
  },
};

const FALLBACK_PALETTES = [
  {
    gradient: "from-violet-950 via-zinc-900 to-zinc-950",
    glow: "rgba(139, 92, 246, 0.26)",
  },
  {
    gradient: "from-emerald-950 via-zinc-900 to-zinc-950",
    glow: "rgba(16, 185, 129, 0.25)",
  },
  {
    gradient: "from-rose-950 via-zinc-900 to-zinc-950",
    glow: "rgba(244, 63, 94, 0.26)",
  },
  {
    gradient: "from-sky-950 via-zinc-900 to-zinc-950",
    glow: "rgba(56, 189, 248, 0.25)",
  },
];

function hashTitle(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

export function getMovieArtwork(movie) {
  const rawTitle = (movie?.title || "Untitled Movie").trim();
  const titleKey = (movie?.titleKey || rawTitle).trim().toLowerCase();
  const matched = MOVIE_ARTWORK_BY_KEY[titleKey];

  if (matched) {
    return matched;
  }

  const fallback =
    FALLBACK_PALETTES[hashTitle(titleKey || "movie") % FALLBACK_PALETTES.length];
  const parts = rawTitle.split(":");

  return {
    poster: null,
    hero: HERO_BACKDROP_SRC,
    eyebrow: parts.length > 1 ? parts[0].trim() : "MCU Timeline",
    displayTitle: (parts.length > 1 ? parts.slice(1).join(":") : rawTitle)
      .trim()
      .toUpperCase(),
    tagline: "Custom MCU Timeline Chapter",
    badge: "Timeline Entry",
    ...fallback,
  };
}
