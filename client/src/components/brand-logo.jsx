export default function BrandLogo({ compact = false }) {
  return (
    <span className="group/logo inline-flex items-center gap-3">
      {/* Crisp inline SVG prism emblem with ambient aurora halo */}
      <span className="relative grid shrink-0 place-items-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-rose-500/35 via-violet-500/30 to-sky-400/35 opacity-75 blur-md transition duration-300 group-hover/logo:opacity-100 group-hover/logo:blur-lg"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          className={`relative transition duration-300 group-hover/logo:scale-105 ${
            compact ? "size-8" : "size-9 sm:size-10"
          }`}
        >
          <defs>
            <linearGradient
              id="brand-bg"
              x1="4"
              y1="2"
              x2="44"
              y2="46"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#1e1b38" />
              <stop offset="50%" stopColor="#0d1322" />
              <stop offset="100%" stopColor="#070a12" />
            </linearGradient>
            <linearGradient
              id="brand-rim"
              x1="2"
              y1="2"
              x2="46"
              y2="46"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="48%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient
              id="brand-left"
              x1="13"
              y1="11"
              x2="27"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="55%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <linearGradient
              id="brand-right"
              x1="18"
              y1="14"
              x2="36"
              y2="34"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient
              id="brand-ring"
              x1="8"
              y1="8"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          <rect
            x="2.5"
            y="2.5"
            width="43"
            height="43"
            rx="13"
            fill="url(#brand-bg)"
            stroke="url(#brand-rim)"
            strokeWidth="1.75"
          />
          <path
            d="M 6 14 C 6 8.5 10.5 4.5 16 4.5 H 32 C 37.5 4.5 42 8.5 42 14 C 31 11.5 17 11.5 6 14 Z"
            fill="#ffffff"
            fillOpacity="0.09"
          />
          <circle
            cx="24"
            cy="24"
            r="15.5"
            stroke="url(#brand-ring)"
            strokeWidth="1.4"
            strokeDasharray="18 7"
            strokeLinecap="round"
          />
          <path
            d="M 15.5 13.2 C 15.5 11.9 17.0 11.1 18.1 11.8 L 25.4 16.4 L 20.5 24 L 25.4 31.6 L 18.1 36.2 C 17.0 36.9 15.5 36.1 15.5 34.8 V 13.2 Z"
            fill="url(#brand-left)"
          />
          <path
            d="M 21.2 14.4 L 34.6 22.5 C 35.8 23.2 35.8 24.8 34.6 25.5 L 21.2 33.6 L 25.8 24 L 21.2 14.4 Z"
            fill="url(#brand-right)"
          />
          <polygon
            points="21.5,24 25.2,21.5 29.5,24 25.2,26.5"
            fill="#ffffff"
          />
        </svg>
      </span>

      {/* Modern Streaming Typography Lockup */}
      <span
        className={
          compact
            ? "flex items-center gap-2"
            : "hidden items-center gap-2 sm:flex"
        }
      >
        <span
          className={`font-black uppercase tracking-[0.18em] text-white drop-shadow ${
            compact ? "text-xs" : "text-[14px]"
          }`}
        >
          Doomsday
        </span>
        <span
          className={`rounded-md border border-sky-300/35 bg-gradient-to-r from-rose-500/20 via-violet-500/20 to-sky-400/25 font-mono font-extrabold uppercase text-sky-200 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] ${
            compact
              ? "px-1.5 py-0.5 text-[9px] tracking-[0.2em]"
              : "px-2 py-0.5 text-[9px] tracking-[0.22em]"
          }`}
        >
          Ready
        </span>
      </span>
    </span>
  );
}
