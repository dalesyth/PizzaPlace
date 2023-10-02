const express = require("express");
const {
  getAllOpenOrders,
  getOrderByOrderId,
  getOrderByUserId,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
} = require("../db/orders");
const ordersRouter = express.Router();

ordersRouter.use((req, res, next) => {
  console.log("A request is being made to /orders");

  next();
});

// GET /api/orders/

ordersRouter.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    if (!orders) {
      restart.status(404).send("No orders found");
    } else {
      res.status(200).send(orders);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/orders/open-orders

ordersRouter.get("/open-orders", async (req, res, next) => {
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
  const { userId } = req.params;
  try {
    const order = await getOrderByUserId(userId);

    if (!order || order.length === 0) {
      res.status(404).send("Unable to retrieve order");
    } else {
      res.status(200).send(order);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/orders/

ordersRouter.post("/", async (req, res, next) => {
  const { userId, orderDate, orderTotal } = req.body;

  try {
    const order = await createOrder({ userId, orderDate, orderTotal });

    if (!order || order.length === 0) {
      res.status(404).send("Unable to create order");
    } else {
      res.status(200).send(order);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/orders/:orderId

ordersRouter.patch("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  const updateFields = req.body;

  try {
    const updatedOrder = await updateOrder(orderId, updateFields);

    if (!updatedOrder || updatedOrder.length === 0) {
      res.status(404).send("Unable to update order");
    } else {
      res.status(200).send(updatedOrder);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/orders/:orderId

ordersRouter.delete("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await deleteOrder(orderId);

    if (!deletedOrder || deletedOrder.length === 0) {
      res.status(404).send("Unable to delete order");
    } else {
      res.status(200).send("Order has been deleted");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = ordersRouter;
