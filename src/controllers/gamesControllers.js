import { connection } from "../database/db.js";
import joi from "joi";

const gameSchema = joi.object({
    name: joi.string().required().min(2),
    image: joi.string().required(),
    stockTotal: joi.number().required().greater(0),
    categoryId: joi.number().required().greater(0),
    pricePerDay: joi.number().required().greater(0)
});

const createGame = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const validation = gameSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    try {
        const categories = (await connection.query('SELECT * FROM categories;')).rows;

        const isCategoryId = categories.find(value => value.id === categoryId);

        if(!isCategoryId) {
            return res.sendStatus(400);
        }

        const games = (await connection.query('SELECT * FROM games;')).rows;

        const isGame = games.find(value => value.name.toLowerCase() === name.toLowerCase());

        if(isGame) {
            return res.sendStatus(409);
        }

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);', [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const readGames = async (req, res) => {
    const { name } = req.query;

    if(name) {
        const gamesQuery = await connection.query('SELECT games.id, games.name, games.image, games."stockTotal", games."pricePerDay", categories.id AS "categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER(games.name) LIKE ($1);', [`%${name.toLowerCase()}%`]);

        return res.send(gamesQuery.rows);
    }

    const games = await connection.query('SELECT games.id, games.name, games.image, games."stockTotal", games."pricePerDay", categories.id AS "categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;');    

    res.send(games.rows);
};

export { createGame, readGames };