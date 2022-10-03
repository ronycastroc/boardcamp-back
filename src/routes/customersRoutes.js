import express from "express";
import { createCustomer, readCustomers, readCustomerId, updateCustomer } from "../controllers/customersControllers.js";
import { validateCustomers } from "../middlewares/joiMiddlewares.js";

const router = express.Router();

router.post("/customers", validateCustomers, createCustomer);
router.get("/customers", readCustomers);
router.get("/customers/:id", readCustomerId);
router.put("/customers/:id", validateCustomers, updateCustomer);

export default router;