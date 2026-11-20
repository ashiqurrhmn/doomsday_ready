import { Router } from "express";

import {
  createMovie,
  getMovies,
  getMovieRewatchOrder,
  updateMovie,
} from "../controllers/movie.controller.js";

const router = Router();

router.post("/", createMovie);
router.get("/", getMovies);
router.get("/:id/rewatch-order", getMovieRewatchOrder);
router.patch("/:id", updateMovie);

export default router;