import { connection } from "../database/db.js";
import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().required().min(1),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().required().min(11).max(11),
    birthday: joi.date().required()
});

const createCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;

    const validation = customerSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    try {
        const customers = (await connection.query('SELECT * FROM customers;')).rows;

        const isCustomer = customers.find(value => value.cpf === cpf);

        if(isCustomer) {
            return res.sendStatus(409);
        }

        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);' , [name, phone, cpf, birthday]);

        res.sendStatus(201);

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const readCustomers = async (req, res) => {
    const { cpf } = req.query;

    try {
        if(cpf) {
            const customers = await connection.query('SELECT * FROM customers WHERE customers.cpf LIKE ($1);', [`${cpf}%`]);
    
            return res.send(customers.rows);
        }
    
        const customers = await connection.query('SELECT * FROM customers;');
    
        res.send(customers.rows);

    } catch (error) {
        res.status(500).send(error.message);
    }    
};

const readCustomerId = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id=$1;', [id]);

        if(!customer.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(customer.rows);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateCustomer = async (req, res) => {    
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    const validation = customerSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id=$1;', [id]);

        if(!customer.rows[0]) {
            return res.sendStatus(404);
        }

        await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;', [name, phone, cpf, birthday, id]);

        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export { createCustomer, readCustomers, readCustomerId, updateCustomer };

