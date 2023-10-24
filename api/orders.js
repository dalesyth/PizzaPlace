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

    if (!order) {
      res.status(404).send("Order not found");
    } else {
      res.status(200).send(order);
    }
   
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/orders/:userId/user

ordersRouter.get("/:userId/user", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const order = await getOrderByUserId(userId);

    if (!order) {
      res.status(404).send("No orders found");
    } else {
      res.status(200).send(order);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/orders/

ordersRouter.post("/", async (req, res, next) => {
  
  const { user_id, order_date, order_total } = req.body;
  console.log("user_id from createNewOrder: ", user_id)

  try {
    const order = await createOrder({ user_id, order_date, order_total });

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

    if (!deletedOrder) {
      res.status(404).send("Unable to delete order");
    } else {
      res.status(200).send("Order has been deleted");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = ordersRouter;
