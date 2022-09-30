import express from "express";
import { createGame, readGames } from "../controllers/gamesControllers.js";

const router = express.Router();

router.post("/games", createGame);
router.get("/games", readGames);

export default router;