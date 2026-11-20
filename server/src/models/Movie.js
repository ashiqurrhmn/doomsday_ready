import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    titleKey: {
      type: String,
      required: true,
      unique: true,
    },

    releaseYear: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Release year must be an integer",
      },
    },

    runtimeMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
      validate: {
        validator: Number.isInteger,
        message: "Runtime must be an integer",
      },
    },

    prerequisiteIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
        },
      ],
      default: [],
    },

    watched: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;