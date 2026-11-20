import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    nameKey: {
      type: String,
      required: true,
      unique: true,
    },

    bundleSizes: {
      type: [
        {
          type: Number,
          min: 1,
          max: 500,
        },
      ],
      required: true,
      validate: [
        {
          validator: (sizes) => sizes.length >= 1 && sizes.length <= 10,
          message: "A cinema must have between 1 and 10 bundle sizes",
        },
        {
          validator: (sizes) => new Set(sizes).size === sizes.length,
          message: "Bundle sizes must be different",
        },
        {
          validator: (sizes) => sizes.every(Number.isInteger),
          message: "Bundle sizes must be integers",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

export default Cinema;
