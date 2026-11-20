import assert from "node:assert/strict";
import test from "node:test";

import { getMinimumBundleQuote } from "../src/services/booking.js";

test("uses two bundles of 3 for a group of 6", () => {
  assert.deepEqual(getMinimumBundleQuote([1, 3, 4], 6), {
    possible: true,
    totalBundles: 2,
    bundles: [{ size: 3, quantity: 2 }],
  });
});

test("reuses bundle sizes to exactly seat a group of 11", () => {
  assert.deepEqual(getMinimumBundleQuote([2, 5], 11), {
    possible: true,
    totalBundles: 4,
    bundles: [
      { size: 5, quantity: 1 },
      { size: 2, quantity: 3 },
    ],
  });
});

test("finds the minimum bundle combination for a group of 44", () => {
  assert.deepEqual(getMinimumBundleQuote([6, 9, 20], 44), {
    possible: true,
    totalBundles: 4,
    bundles: [
      { size: 20, quantity: 1 },
      { size: 9, quantity: 2 },
      { size: 6, quantity: 1 },
    ],
  });
});

test("reports when an exact combination is impossible", () => {
  assert.deepEqual(getMinimumBundleQuote([4, 6], 7), {
    possible: false,
    totalBundles: null,
    bundles: [],
  });
});
