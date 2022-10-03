import express from "express";
import { createGame, readGames } from "../controllers/gamesControllers.js";
import { validateGames } from "../middlewares/joiMiddlewares.js";

const router = express.Router();

router.post("/games", validateGames, createGame);
router.get("/games", readGames);

export default router;