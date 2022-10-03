import { connection } from "../database/db.js";

const createGame = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;    

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

    try {
        if(name) {
            const gamesQuery = await connection.query('SELECT games.id, games.name, games.image, games."stockTotal", games."pricePerDay", categories.id AS "categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER(games.name) LIKE ($1);', [`%${name.toLowerCase()}%`]);
    
            return res.send(gamesQuery.rows);
        }
    
        const games = await connection.query('SELECT games.id, games.name, games.image, games."stockTotal", games."pricePerDay", categories.id AS "categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;');    
    
        res.send(games.rows);
        
    } catch (error) {
        res.status(500).send(error.message);
    }

    
};

export { createGame, readGames };