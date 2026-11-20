import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import movieRoutes from "./routes/movie.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/movies", movieRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Doomsday Ready API is running",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
});

startServer();