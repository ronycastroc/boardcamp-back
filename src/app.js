import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PORT } from "./configs/constants.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

//ROTA CATEGORIAS
app.use(categoriesRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
