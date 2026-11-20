import "dotenv/config";
import mongoose from "mongoose";

import Cinema from "../src/models/Cinema.js";
import Movie from "../src/models/Movie.js";

const movieDefinitions = [
  {
    title: "Iron Man",
    releaseYear: 2008,
    runtimeMinutes: 126,
    prerequisites: [],
  },
  {
    title: "Captain America: The First Avenger",
    releaseYear: 2011,
    runtimeMinutes: 124,
    prerequisites: [],
  },
  {
    title: "The Avengers",
    releaseYear: 2012,
    runtimeMinutes: 143,
    prerequisites: ["Iron Man", "Captain America: The First Avenger"],
  },
  {
    title: "Captain America: Civil War",
    releaseYear: 2016,
    runtimeMinutes: 147,
    prerequisites: ["The Avengers"],
  },
  {
    title: "Thor: Ragnarok",
    releaseYear: 2017,
    runtimeMinutes: 130,
    prerequisites: [],
  },
  {
    title: "Avengers: Infinity War",
    releaseYear: 2018,
    runtimeMinutes: 149,
    prerequisites: ["Captain America: Civil War", "Thor: Ragnarok"],
  },
  {
    title: "Avengers: Endgame",
    releaseYear: 2019,
    runtimeMinutes: 181,
    prerequisites: ["Avengers: Infinity War"],
  },
  {
    title: "Avengers: Doomsday",
    releaseYear: 2026,
    runtimeMinutes: 180,
    prerequisites: ["Avengers: Endgame"],
  },
];

const cinemaDefinitions = [
  { name: "Stark Cinema", bundleSizes: [1, 3, 4] },
  { name: "Wakanda Multiplex", bundleSizes: [2, 5] },
  { name: "Asgard Theater", bundleSizes: [6, 9, 20] },
  { name: "Quantum Cinema", bundleSizes: [4, 6] },
];

async function seedMovies() {
  const moviesByTitle = new Map();

  for (const definition of movieDefinitions) {
    const titleKey = definition.title.toLowerCase();
    const movie = await Movie.findOneAndUpdate(
      { titleKey },
      {
        $set: {
          title: definition.title,
          titleKey,
          releaseYear: definition.releaseYear,
          runtimeMinutes: definition.runtimeMinutes,
        },
        $setOnInsert: {
          watched: false,
          prerequisiteIds: [],
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    moviesByTitle.set(definition.title, movie);
  }

  for (const definition of movieDefinitions) {
    const movie = moviesByTitle.get(definition.title);
    const prerequisiteIds = definition.prerequisites.map(
      (title) => moviesByTitle.get(title)._id,
    );

    await Movie.updateOne(
      { _id: movie._id },
      { $set: { prerequisiteIds } },
      { runValidators: true },
    );
  }

  return moviesByTitle.size;
}

async function seedCinemas() {
  for (const definition of cinemaDefinitions) {
    const nameKey = definition.name.toLowerCase();

    await Cinema.findOneAndUpdate(
      { nameKey },
      {
        $set: {
          name: definition.name,
          nameKey,
          bundleSizes: definition.bundleSizes,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  return cinemaDefinitions.length;
}

async function runSeed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const movieCount = await seedMovies();
    const cinemaCount = await seedCinemas();

    console.log(`Seeded ${movieCount} movies and ${cinemaCount} cinemas`);
  } finally {
    await mongoose.disconnect();
  }
}

runSeed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
