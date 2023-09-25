const express = require("express");
const { getAllToppings } = require("../db/toppings");
const toppingsRouter = express.Router();

// GET /api/toppings

toppingsRouter.get("/", async (req, res, next) => {
    try {
        const toppings = await getAllToppings();
        if (!toppings || toppings.length === 0) {
            res.status(404).send('Toppings not found')
        } else {
            res.status(200).send(toppings)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});









module.exports = {
    toppingsRouter,
};