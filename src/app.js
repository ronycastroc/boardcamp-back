import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { DATABASE_URL, PORT } from './configs/constants.js';

const { Pool } = pkg;

const connection = new Pool ({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '69899323',
    database: 'boardcamp'
});

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
