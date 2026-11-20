import Cinema from "../models/Cinema.js";

export async function createCinema(req, res, next) {
  try {
    const { name, bundleSizes } = req.body ?? {};

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Cinema name is required",
        },
      });
    }

    if (!Array.isArray(bundleSizes)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Bundle sizes must be an array",
        },
      });
    }

    if (bundleSizes.length < 1 || bundleSizes.length > 10) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "A cinema must have between 1 and 10 bundle sizes",
        },
      });
    }

    const invalidBundleSize = bundleSizes.some(
      (size) => !Number.isInteger(size) || size < 1 || size > 500,
    );

    if (invalidBundleSize) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Each bundle size must be an integer between 1 and 500",
        },
      });
    }

    if (new Set(bundleSizes).size !== bundleSizes.length) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Bundle sizes must be different",
        },
      });
    }

    const cleanName = name.trim();

    const cinema = await Cinema.create({
      name: cleanName,
      nameKey: cleanName.toLowerCase(),
      bundleSizes,
    });

    return res.status(201).json(cinema);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: {
          code: "DUPLICATE_NAME",
          message: "A cinema with this name already exists",
        },
      });
    }

    return next(error);
  }
}

export async function getCinemas(req, res, next) {
  try {
    const cinemas = await Cinema.find().sort({ name: 1 });

    return res.status(200).json(cinemas);
  } catch (error) {
    return next(error);
  }
}
