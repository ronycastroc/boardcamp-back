import express from "express";
import { createRentals, readRentals, createRentalsFinished, deleteRentals } from "../controllers/rentalsControllers.js";
import { validateRentals } from "../middlewares/joiMiddlewares.js";

const router = express.Router();

router.post("/rentals", validateRentals, createRentals);
router.post("/rentals/:id/return", createRentalsFinished);
router.get("/rentals", readRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;