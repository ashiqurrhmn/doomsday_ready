export function getMinimumBundleQuote(bundleSizes, groupSize) {
  const sortedSizes = [...bundleSizes].sort((a, b) => b - a);

  const minimumBundles = new Array(groupSize + 1).fill(Infinity);
  const lastBundle = new Array(groupSize + 1).fill(null);

  minimumBundles[0] = 0;

  for (let seats = 1; seats <= groupSize; seats += 1) {
    for (const bundleSize of sortedSizes) {
      if (bundleSize > seats) {
        continue;
      }

      const previousSeats = seats - bundleSize;
      const candidateCount = minimumBundles[previousSeats] + 1;

      if (candidateCount < minimumBundles[seats]) {
        minimumBundles[seats] = candidateCount;
        lastBundle[seats] = bundleSize;
      }
    }
  }

  if (minimumBundles[groupSize] === Infinity) {
    return {
      possible: false,
      totalBundles: null,
      bundles: [],
    };
  }

  const bundleCounts = new Map();
  let remainingSeats = groupSize;

  while (remainingSeats > 0) {
    const bundleSize = lastBundle[remainingSeats];

    bundleCounts.set(
      bundleSize,
      (bundleCounts.get(bundleSize) ?? 0) + 1,
    );

    remainingSeats -= bundleSize;
  }

  const bundles = sortedSizes
    .filter((size) => bundleCounts.has(size))
    .map((size) => ({
      size,
      quantity: bundleCounts.get(size),
    }));

  return {
    possible: true,
    totalBundles: minimumBundles[groupSize],
    bundles,
  };
}
