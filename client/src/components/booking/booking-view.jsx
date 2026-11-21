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

      if (!controller.signal.aborted && requestCounterRef.current === requestId) {
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
      if (!controller.signal.aborted && requestCounterRef.current === requestId) {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
          Cinema booking
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Book the watch party
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">
          Choose an opening-night cinema and enter your group size to find the
          minimum number of seat bundles that fit your group exactly.
        </p>
      </header>

      {cinemasError ? (
        <div
          role="alert"
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-red-200"
        >
          <div>
            <p className="font-semibold">Could not load cinemas.</p>
            <p className="mt-1 text-sm text-red-200/80">{cinemasError}</p>
          </div>
          <button
            type="button"
            onClick={handleRetryCinemas}
            className="rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/30"
          >
            Try again
          </button>
        </div>
      ) : null}

      {isLoadingCinemas ? (
        <div
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          aria-label="Loading cinemas"
        >
          <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
        </div>
      ) : cinemas.length === 0 && !cinemasError ? (
        <section className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            No cinemas available yet
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Seed the database or add a cinema via the API (`POST /api/cinemas`)
            before calculating a watch-party booking quote.
          </p>
        </section>
      ) : cinemas.length > 0 ? (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="lg:sticky lg:top-28">
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
                className="rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-red-200"
              >
                <p className="font-semibold">
                  Could not calculate the booking quote.
                </p>
                <p className="mt-1 text-sm text-red-200/80">{quoteError}</p>
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
              <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-zinc-500">
                  Ready to calculate
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Enter your watch-party details
                </h2>
                <p className="mx-auto mt-3 max-w-md leading-7 text-zinc-400">
                  Select a cinema and enter how many seats you need. We will
                  show the fewest bundles that match your group size exactly.
                </p>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
