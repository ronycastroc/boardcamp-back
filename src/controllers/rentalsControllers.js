import { connection } from "../database/db.js";
import joi from "joi";
import dayjs from "dayjs";

const date = dayjs().locale('pt-br').format('YYYY-MM-DD');

const rentalsSchema = joi.object({
    customerId: joi.number().required().greater(0),
    gameId: joi.number().required().greater(0),
    daysRented: joi.number().required().greater(0)
});

const createRentals = async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    const returnDate = null;
    const delayFee = null;

    const validation = rentalsSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    try {
        const customers = (await connection.query('SELECT * FROM customers;')).rows;

        const isCustomer = customers.find(value => value.id === customerId);

        if(!isCustomer) {
            return res.sendStatus(400);
        }

        const games = (await connection.query('SELECT * FROM games;')).rows;

        const isGameAvaible = games.find(value => value.id === gameId && value.stockTotal > 0);

        if(!isGameAvaible) {
            return res.sendStatus(400);
        }

        const originalPrice = games.filter(value => value.id === gameId).map(value => value.pricePerDay * daysRented);

        const outGame = games.filter(value => value.id === gameId).map(value => value.stockTotal - 1);

        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);', [customerId, gameId, date, daysRented, returnDate, Number(originalPrice), delayFee]);

        await connection.query('UPDATE games SET "stockTotal"=$1 WHERE id=$2;', [Number(outGame), gameId]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createRentalsFinished = async (req, res) => {
    const { id } = req.params;

    try {
        const rentals = (await connection.query('SELECT * FROM rentals;')).rows;

        const isRent = rentals.find(value => value.id === id);

        if(!isRent) {
            return res.sendStatus(404);
        }

        const isFinished = rentals.find(value => value.id === id && value.returnDate === null);

        if(!isFinished) {
            return res.sendStatus(400);
        }

        const rentDelay = rentals.find(value => value.id === id &&  
            (Number(new Date().toLocaleDateString('pt-br').slice('0', '2')) - 
            value.rentDate.toLocaleDateString('pt-br').slice('0', '2')) > 
            value.daysRented);

            if(rentDelay) {
                const daysDelay = (Number(new Date().toLocaleDateString('pt-br').slice('0', '2')) - 
                rentDelay.rentDate.toLocaleDateString('pt-br').slice('0', '2'))

                const delayFee = (daysDelay - rentDelay.daysRented) * rentDelay.originalPrice;

                await connection.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2  WHERE id=$3;', [date, delayFee, id]);
                
                return res.sendStatus(200);
            }

        await connection.query('UPDATE rentals SET "returnDate"=$1 WHERE id=$2;', [date, id]);

        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const readRentals = async (req, res) => {
    const { customerId, gameId } = req.query;

    try {
        if(customerId) {
            const rentals = await connection.query('SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId"=$1;', [customerId]);

            return res.send(rentals.rows);
        }

        if(gameId) {
            const rentals = await connection.query('SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId"=$1;', [gameId]);

            return res.send(rentals.rows);
        }

        const rentals = await connection.query('SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;');

       
        
        console.log(rentals.rows[0].daysRented)
        
        res.send(rentals.rows);

    } catch (error) {
        res.status(500).send(error.message);
    }   
};

export { createRentals, readRentals, createRentalsFinished };