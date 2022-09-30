import { connection } from "../database/db.js";
import joi from "joi";

const categorySchema = joi.object({
    name: joi.string().required().min(2)
});

const createCategory = async (req, res) => {
    const { name } = req.body;

    const validation = categorySchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);
        return res.status(400).send(error);
    }

    try {
        const categories = (await connection.query('SELECT * FROM categories;')).rows;

        const isCategory = categories.find(value => value.name.toLowerCase() === name.toLowerCase());

        if(isCategory) {
            return res.sendStatus(409);
        }

        await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);

        res.sendStatus(201);
        
    } catch (error) {
        res.status(500).send(error.message);
    }    
};

const readCategories = async (req, res) => {
    const categories = await connection.query('SELECT * FROM categories;');

    res.send(categories.rows);
};

export { createCategory, readCategories };

