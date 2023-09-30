const express = require("express");
const { getOrderedPizzaByPizzaId, getOrderedPizzasByUser } = require("../db/orderedpizzas");
const orderedPizzaRouter = express.Router();

// GET /api/ordered-pizza

orderedPizzaRouter.get("/:pizzaId", async (req, res, next) => {
    const { pizzaId } = req.params
    try {
        const orderedPizza = await getOrderedPizzaByPizzaId(pizzaId)

        if (!orderedPizza || orderedPizza.length === 0) {
            res.status(404).send("Unable to retrieve this ordered pizza")
        } else {
            res.status(200).send(orderedPizza)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

orderedPizzaRouter.get("/user/:userId", async (req, res, next) => {
    const { userId } = req.params
    try {
        const orderedPizza = await getOrderedPizzasByUser(userId)

        if (!orderedPizza || orderedPizza.length === 0) {
            res.status(404).send("Unable to retrieve ordered pizza")
        } else {
            res.status(200).send(orderedPizza)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})






module.exports = {
    orderedPizzaRouter,
}