import joi from "joi";

const categorySchema = joi.object({
    name: joi.string().required().min(2)
});

const customerSchema = joi.object({
    name: joi.string().required().min(1),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().required().min(11).max(11),
    birthday: joi.date().required()
});

const gameSchema = joi.object({
    name: joi.string().required().min(2),
    image: joi.string().required(),
    stockTotal: joi.number().required().greater(0),
    categoryId: joi.number().required().greater(0),
    pricePerDay: joi.number().required().greater(0)
});

const rentalsSchema = joi.object({
    customerId: joi.number().required().greater(0),
    gameId: joi.number().required().greater(0),
    daysRented: joi.number().required().greater(0)
});

async function validateCategory (req, res, next) {
    const validation = categorySchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);
        
        return res.status(400).send(error);
    }

    next();
};

async function validateCustomers (req, res, next) {
    const validation = customerSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    next();
}

async function validateGames (req, res, next) {
    const validation = gameSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    next();
}

async function validateRentals (req, res, next) {
    const validation = rentalsSchema.validate(req.body, { abortEarly: false });

    if(validation.error) {
        const error = validation.error.details.map(value => value.message);

        return res.status(400).send(error);
    }

    next();
}

export { validateCategory, validateCustomers, validateGames, validateRentals };