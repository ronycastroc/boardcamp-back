import express from "express";
import { createCategory, readCategories } from "../controllers/categoriesControllers.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", readCategories);

export default router;