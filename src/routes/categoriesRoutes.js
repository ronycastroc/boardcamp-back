import express from "express";
import { createCategory, readCategories } from "../controllers/categoriesControllers.js";
import { validateCategory } from "../middlewares/joiMiddlewares.js";

const router = express.Router();

router.post("/categories", validateCategory, createCategory);
router.get("/categories", readCategories);

export default router;