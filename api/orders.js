const express = require('express')
const { getAllOpenOrders } = require('../db/orders')
const ordersRouter = express.Router()

// GET /api/orders

ordersRouter.get("/", async (req, res, next) => {
    try {
        const orders = await getAllOpenOrders()

        if (!orders || orders.length === 0) {
            res.status(404).send("Unable to retrieve open orders")
        } else {
            res.status(200).send(orders)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// GET /api/orders/:orderId

orders





module.exports = { ordersRouter }