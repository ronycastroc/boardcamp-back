import { connection } from "../database/db.js";

const createCategory = async (req, res) => {
    const { name } = req.body; 

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
    try {
        const categories = await connection.query('SELECT * FROM categories;');

    res.send(categories.rows);

    } catch (error) {
        res.status(500).send(error.message);
    }    
};

export { createCategory, readCategories };

