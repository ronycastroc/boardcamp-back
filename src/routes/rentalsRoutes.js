import express from "express";
import { createRentals, readRentals, createRentalsFinished } from "../controllers/rentalsControllers.js";

const router = express.Router();

router.post("/rentals", createRentals);
router.post("/rentals/:id/return", createRentalsFinished);
router.get("/rentals", readRentals);

export default router;