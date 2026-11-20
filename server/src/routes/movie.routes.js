import { Router } from "express";

import {
  createMovie,
  getMovies,
  updateMovie,
} from "../controllers/movie.controller.js";

const router = Router();

router.post("/", createMovie);
router.get("/", getMovies);
router.patch("/:id", updateMovie);

export default router;