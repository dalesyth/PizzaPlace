const express = require("express");
const orderedPizzaRouter = express.Router();

// GET /api/ordered-pizza

orderedPizzaRouter.get("/", async (req, res, next) => {
    try {
        const orderedPizza = 
    } catch ({ name, message }) {
        next({ name, message })
    }
})






module.exports = {
    orderedPizzaRouter,
}