const express = require('express');

const apiRouter = express.Router();

//GET /api/health
apiRouter.get("/health", async (req, res) => {
    res.send({ message: "All is well"});
});

// ROUTER: /api/users
const usersRouter = require('./users');
apiRouter.use("/users", usersRouter);

// ROUTE: /api/orders
const ordersRouter = require('./orders');
apiRouter.use("/orders", ordersRouter);

// ROUTE: /api/toppings
const toppingsRouter = require('./toppings');
apiRouter.use("/toppings", toppingsRouter);

// ROUTE: /api/sauces
const saucesRouter = require('./sauces');
apiRouter.use("/sauces", saucesRouter);

// ROUTE: /api/crusts
const crustsRouter = require('./crusts');
apiRouter.use("/crusts", crustsRouter);

// ROUTE: /api/ordered-pizza
const orderedPizzaRouter = require('./orderedpizzas');
apiRouter.use("/ordered-pizza", orderedPizzaRouter);


// ERROR HANDLER
apiRouter.use((error, req, res, next) => {
    res.status(500).send({
        name: error.name,
        message: error.message,
    });
});




module.exports = apiRouter;

