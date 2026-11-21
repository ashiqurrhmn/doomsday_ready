"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "@/lib/api";
import BookingForm from "./booking-form";
import BookingResult from "./booking-result";

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

export default function BookingView() {
  const [cinemas, setCinemas] = useState([]);
  const [isLoadingCinemas, setIsLoadingCinemas] = useState(true);
  const [cinemasError, setCinemasError] = useState("");

  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [validationError, setValidationError] = useState("");

  const [quote, setQuote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const quoteAbortRef = useRef(null);
  const requestCounterRef = useRef(0);

  const fetchCinemas = useCallback(async (signal) => {
    const data = await apiRequest("/cinemas", { signal });
    setCinemas(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setCinemasError("");
        await fetchCinemas(controller.signal);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCinemasError(getErrorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCinemas(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
      quoteAbortRef.current?.abort();
    };
  }, [fetchCinemas]);

  const selectedCinema = useMemo(
    () => cinemas.find((cinema) => cinema._id === selectedCinemaId) || null,
    [cinemas, selectedCinemaId],
  );

  function clearCurrentQuote() {
    quoteAbortRef.current?.abort();
    requestCounterRef.current += 1;
    setQuote(null);
    setQuoteError("");
    setIsSubmitting(false);
  }

  function handleCinemaChange(nextCinemaId) {
    setSelectedCinemaId(nextCinemaId);
    setValidationError("");
    clearCurrentQuote();
  }

  function handleGroupSizeChange(nextValue) {
    setGroupSize(nextValue);
    setValidationError("");
    clearCurrentQuote();
  }

  async function handleRetryCinemas() {
    setIsLoadingCinemas(true);
    setCinemasError("");

    try {
      await fetchCinemas();
    } catch (error) {
      setCinemasError(getErrorMessage(error));
    } finally {
      setIsLoadingCinemas(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");
    setQuoteError("");

    if (!selectedCinemaId) {
      setValidationError("Choose a cinema first.");
      return;
    }

    const trimmedGroupSize = groupSize.trim();

    if (!/^[1-9]\d*$/.test(trimmedGroupSize)) {
      setValidationError("Group size must be a whole number from 1 to 10,000.");
      return;
    }

    const parsedGroupSize = Number(trimmedGroupSize);

    if (parsedGroupSize < 1 || parsedGroupSize > 10000) {
      setValidationError("Group size must be a whole number from 1 to 10,000.");
      return;
    }

    quoteAbortRef.current?.abort();
    const controller = new AbortController();
    quoteAbortRef.current = controller;
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setQuote(null);
    setIsSubmitting(true);

    try {
      const data = await apiRequest(
        `/cinemas/${selectedCinemaId}/booking?groupSize=${encodeURIComponent(trimmedGroupSize)}`,
        { signal: controller.signal },
      );

      if (
        !controller.signal.aborted &&
        requestCounterRef.current === requestId
      ) {
        setQuote(data);
      }
    } catch (error) {
      if (
        error.name !== "AbortError" &&
        requestCounterRef.current === requestId
      ) {
        setQuoteError(getErrorMessage(error));
      }
    } finally {
      if (
        !controller.signal.aborted &&
        requestCounterRef.current === requestId
      ) {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#06070b]">
      {/* Premiere-Night Widescreen Top Backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/heroes/endgame.jpg?v=8"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-center opacity-35 blur-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070b]/45 via-[#06070b]/85 to-[#06070b]" />
      </div>

      <div className="mx-auto w-full max-w-[1380px] px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-14">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]">
              <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              Opening-Night Watch Party
            </span>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.03em] text-white drop-shadow sm:text-5xl lg:text-6xl">
              Book The Watch Party
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-300 sm:text-lg">
              Opening-night seats are sold in group bundles. Pick a cinema and
              enter your group size (1–10,000) to calculate the minimum exact
              bundles with zero empty seats.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.35)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Cinemas
              </dt>
              <dd className="mt-1.5 text-2xl font-black text-white sm:text-3xl">
                {cinemas.length}
              </dd>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                Premiere venues
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.35)]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Max Group
              </dt>
              <dd className="mt-1.5 text-2xl font-black text-emerald-300 sm:text-3xl">
                10,000
              </dd>
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                0 wasted seats
              </p>
            </div>
          </dl>
        </header>

        {cinemasError ? (
          <div
            role="alert"
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-400/35 bg-rose-950/35 px-5 py-4 text-rose-100 backdrop-blur-2xl"
          >
            <div>
              <p className="font-bold text-white">Could not load cinemas.</p>
              <p className="mt-1 text-sm text-rose-200/85">{cinemasError}</p>
            </div>
            <button
              type="button"
              onClick={handleRetryCinemas}
              className="rounded-full border border-white/25 bg-white/[0.14] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/[0.22]"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {isLoadingCinemas ? (
          <div
            className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
            aria-label="Loading cinemas"
          >
            <div className="h-[460px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          </div>
        ) : cinemas.length === 0 && !cinemasError ? (
          <section className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              No cinemas available yet
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-400">
              Seed the database or add a cinema via the API (`POST /api/cinemas`)
              before calculating a watch-party booking quote.
            </p>
          </section>
        ) : cinemas.length > 0 ? (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="lg:sticky lg:top-24">
              <BookingForm
                cinemas={cinemas}
                selectedCinemaId={selectedCinemaId}
                selectedCinema={selectedCinema}
                groupSize={groupSize}
                validationError={validationError}
                isSubmitting={isSubmitting}
                onCinemaChange={handleCinemaChange}
                onGroupSizeChange={handleGroupSizeChange}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="grid gap-6">
              {quoteError ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-400/35 bg-rose-950/35 px-5 py-4 text-rose-100 backdrop-blur-2xl"
                >
                  <p className="font-bold text-white">
                    Could not calculate the booking quote.
                  </p>
                  <p className="mt-1 text-sm text-rose-200/85">{quoteError}</p>
                </div>
              ) : null}

              {isSubmitting ? (
                <div
                  className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                  aria-label="Calculating booking quote"
                />
              ) : quote ? (
                <BookingResult quote={quote} cinema={selectedCinema} />
              ) : !quoteError ? (
                <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-2xl">
                  <span className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300">
                    Ready to calculate
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-white">
                    Enter your watch-party details
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-zinc-400">
                    Select a premiere cinema on the left and enter how many
                    seats your group needs. We will compute the fewest exact
                    bundles so nobody pays for an empty seat.
                  </p>
                </section>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
