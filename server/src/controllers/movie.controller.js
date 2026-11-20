import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import { hasCircularDependency } from "../services/movieGraph.js";

export async function createMovie(req, res, next) {
  try {
    const {
      title,
      releaseYear,
      runtimeMinutes,
      prerequisiteIds = [],
      watched = false,
    } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Title is required",
        },
      });
    }

    if (!Number.isInteger(releaseYear) || releaseYear < 1) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Release year must be a positive integer",
        },
      });
    }

    if (
      !Number.isInteger(runtimeMinutes) ||
      runtimeMinutes < 1 ||
      runtimeMinutes > 300
    ) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Runtime must be between 1 and 300 minutes",
        },
      });
    }

    if (typeof watched !== "boolean") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Watched must be true or false",
        },
      });
    }

    if (!Array.isArray(prerequisiteIds)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Prerequisite IDs must be an array",
        },
      });
    }

    const uniqueIds = new Set(prerequisiteIds);

    if (uniqueIds.size !== prerequisiteIds.length) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Duplicate prerequisite IDs are not allowed",
        },
      });
    }

    const invalidId = prerequisiteIds.some(
      (id) => !mongoose.isObjectIdOrHexString(id),
    );

    if (invalidId) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "A prerequisite ID is invalid",
        },
      });
    }

    if (prerequisiteIds.length > 0) {
      const existingCount = await Movie.countDocuments({
        _id: { $in: prerequisiteIds },
      });

      if (existingCount !== prerequisiteIds.length) {
        return res.status(404).json({
          error: {
            code: "PREREQUISITE_NOT_FOUND",
            message: "One or more prerequisite movies do not exist",
          },
        });
      }
    }

    const cleanTitle = title.trim();

    const movie = await Movie.create({
      title: cleanTitle,
      titleKey: cleanTitle.toLowerCase(),
      releaseYear,
      runtimeMinutes,
      prerequisiteIds,
      watched,
    });

    return res.status(201).json(movie);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: {
          code: "DUPLICATE_TITLE",
          message: "A movie with this title already exists",
        },
      });
    }

    return next(error);
  }
}

export async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find()
      .populate("prerequisiteIds", "title releaseYear runtimeMinutes watched")
      .sort({ title: 1 });

    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
}

export async function updateMovie(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Movie ID is invalid",
        },
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Movie not found",
        },
      });
    }

    const allowedFields = new Set([
      "title",
      "releaseYear",
      "runtimeMinutes",
      "prerequisiteIds",
      "watched",
    ]);

    const receivedFields = Object.keys(req.body);

    if (receivedFields.length === 0) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "At least one field is required",
        },
      });
    }

    const unknownField = receivedFields.find(
      (field) => !allowedFields.has(field),
    );

    if (unknownField) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: `Unknown field: ${unknownField}`,
        },
      });
    }

    if (Object.hasOwn(req.body, "title")) {
      if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Title cannot be empty",
          },
        });
      }

      movie.title = req.body.title.trim();
      movie.titleKey = movie.title.toLowerCase();
    }

    if (Object.hasOwn(req.body, "releaseYear")) {
      if (
        !Number.isInteger(req.body.releaseYear) ||
        req.body.releaseYear < 1
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Release year must be a positive integer",
          },
        });
      }

      movie.releaseYear = req.body.releaseYear;
    }

    if (Object.hasOwn(req.body, "runtimeMinutes")) {
      if (
        !Number.isInteger(req.body.runtimeMinutes) ||
        req.body.runtimeMinutes < 1 ||
        req.body.runtimeMinutes > 300
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Runtime must be between 1 and 300 minutes",
          },
        });
      }

      movie.runtimeMinutes = req.body.runtimeMinutes;
    }

    if (Object.hasOwn(req.body, "watched")) {
      if (typeof req.body.watched !== "boolean") {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Watched must be true or false",
          },
        });
      }

      movie.watched = req.body.watched;
    }

    if (Object.hasOwn(req.body, "prerequisiteIds")) {
      const prerequisiteIds = req.body.prerequisiteIds;

      if (!Array.isArray(prerequisiteIds)) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Prerequisite IDs must be an array",
          },
        });
      }

      if (new Set(prerequisiteIds).size !== prerequisiteIds.length) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Duplicate prerequisite IDs are not allowed",
          },
        });
      }

      if (
        prerequisiteIds.some(
          (prerequisiteId) =>
            !mongoose.isObjectIdOrHexString(prerequisiteId),
        )
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "A prerequisite ID is invalid",
          },
        });
      }

      if (
        prerequisiteIds.some(
          (prerequisiteId) => prerequisiteId.toString() === id.toString(),
        )
      ) {
        return res.status(409).json({
          error: {
            code: "CIRCULAR_DEPENDENCY",
            message: "A movie cannot depend on itself",
          },
        });
      }

      const existingCount = await Movie.countDocuments({
        _id: { $in: prerequisiteIds },
      });

      if (existingCount !== prerequisiteIds.length) {
        return res.status(404).json({
          error: {
            code: "PREREQUISITE_NOT_FOUND",
            message: "One or more prerequisite movies do not exist",
          },
        });
      }

      const allMovies = await Movie.find()
        .select("_id prerequisiteIds")
        .lean();

      const circular = hasCircularDependency(
        allMovies,
        id,
        prerequisiteIds,
      );

      if (circular) {
        return res.status(409).json({
          error: {
            code: "CIRCULAR_DEPENDENCY",
            message: "This update would create a circular dependency",
          },
        });
      }

      movie.prerequisiteIds = prerequisiteIds;
    }

    await movie.save();
    await movie.populate(
      "prerequisiteIds",
      "title releaseYear runtimeMinutes watched",
    );

    return res.status(200).json(movie);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: {
          code: "DUPLICATE_TITLE",
          message: "A movie with this title already exists",
        },
      });
    }

    return next(error);
  }
}