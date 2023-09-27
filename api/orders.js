const express = require("express");
const { getAllOpenOrders, getOrderByOrderId, getOrderByUserId, createOrder } = require("../db/orders");
const ordersRouter = express.Router();

// GET /api/orders

ordersRouter.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOpenOrders();

    if (!orders || orders.length === 0) {
      res.status(404).send("Unable to retrieve open orders");
    } else {
      res.status(200).send(orders);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/orders/:orderId/order

ordersRouter.get("/:orderId/order", async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await getOrderByOrderId(orderId);

    if (!order || order.length === 0) {
      res.status(404).send("Unable to retrieve order");
    } else {
      res.status(200).send(order);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/orders/:userId/order

ordersRouter.get("/:userId/order", async (req, res, next) => {
    const { userId } = req.params
    try {
        const order = await getOrderByUserId(userId);

        if (!order || order.length === 0) {
            res.status(404).send("Unable to retrieve order")
        } else {
            res.status(200).send(order)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// POST /api/orders/

ordersRouter.post("/", async (req, res, next) => {
    const { userId, orderDate, orderTotal } = req.body

    try {
        const order = await createOrder({ userId, orderDate, orderTotal })

        if (!order || order.length === 0) {
            res.status(404).send("Unable to create order")
        } else {
            res.status(200).send(order)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})



module.exports = { ordersRouter };
