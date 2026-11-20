import { Router } from "express";

import {
  createCinema,
  getCinemas,
} from "../controllers/cinema.controller.js";

const router = Router();

router.post("/", createCinema);
router.get("/", getCinemas);

export default router;
