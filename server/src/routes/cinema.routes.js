import { Router } from "express";

import {
  createCinema,
  getBookingQuote,
  getCinemas,
} from "../controllers/cinema.controller.js";

const router = Router();

router.post("/", createCinema);
router.get("/", getCinemas);
router.get("/:id/booking", getBookingQuote);

export default router;
