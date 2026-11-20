import mongoose from "mongoose";
import Movie from "../models/Movie.js";

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