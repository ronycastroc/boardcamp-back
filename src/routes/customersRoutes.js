import express from "express";
import { createCustomer, readCustomers, readCustomerId, updateCustomer } from "../controllers/customersControllers.js";

const router = express.Router();

router.post("/customers", createCustomer);
router.get("/customers", readCustomers);
router.get("/customers/:id", readCustomerId);
router.put("/customers/:id", updateCustomer);

export default router;