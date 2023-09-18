const express = require('express')

const apiRouter = express.Router();

//GET /api/health
apiRouter.get("/health", async (req, res) => {
    res.send({ message: "All is well"});
});

// ROUTER: /api/users
const usersRouter = require('./users')
apiRouter.use("/users", usersRouter);

// ROUTE: /api/orders
const ordersRouter = require('./orders')
apiRouter.use("/orders", ordersRouter);












// ERROR HANDLER
apiRouter.use((error, req, res) => {
    res.status(500).json({
        name: error.name,
        message: error.message,
    });
});




module.exports = { apiRouter }

