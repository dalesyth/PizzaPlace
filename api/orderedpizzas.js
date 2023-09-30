const express = require("express");
const {
  getOrderedPizzaByPizzaId,
  getOrderedPizzasByUser,
  createOrderedPizza,
  updateOrderedPizza,
  deleteOrderedPizza,
} = require("../db/orderedpizzas");
const orderedPizzaRouter = express.Router();

// GET /api/ordered-pizza

orderedPizzaRouter.get("/:pizzaId", async (req, res, next) => {
  const { pizzaId } = req.params;
  try {
    const orderedPizza = await getOrderedPizzaByPizzaId(pizzaId);

    if (!orderedPizza || orderedPizza.length === 0) {
      res.status(404).send("Unable to retrieve this ordered pizza");
    } else {
      res.status(200).send(orderedPizza);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

orderedPizzaRouter.get("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const orderedPizza = await getOrderedPizzasByUser(userId);

    if (!orderedPizza || orderedPizza.length === 0) {
      res.status(404).send("Unable to retrieve ordered pizza");
    } else {
      res.status(200).send(orderedPizza);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/ordered-pizza

orderedPizzaRouter.post("/", async (req, res, next) => {
  const { order_id, pizza_price, quantity, size, crust, sauce } = req.body;

  try {
    const orderedPizza = await createOrderedPizza({
      order_id,
      pizza_price,
      quantity,
      size,
      crust,
      sauce,
    });

    if (!orderedPizza) {
      res.status(404).send("Unable to create order");
    } else {
      res.status(200).send(orderedPizza);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/ordered-pizza/:pizzaId

orderedPizzaRouter.patch("/:pizzaId", async (req, res, next) => {
    const { pizzaId } = req.params
    const updateFields = req.body
    try {
        const updatedPizza = await updateOrderedPizza(pizzaId, updateFields)

        if (!updatedPizza) {
            res.status(404).send("Unable to update ordered pizza")
        } else {
            res.status(200).send(updatedPizza)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// DELETE /api/ordered-pizza/:pizzaId

orderedPizzaRouter.delete("/:pizzaId", async (req, res, next) => {
    const { pizzaId } = req.params
    try {
        const deletedPizza = await deleteOrderedPizza(pizzaId)

        if (!deletedPizza) {
            res.status(404).send("Unable to delete the pizza")
        } else {
            res.status(200).send("Pizza has been deleted")
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = {
  orderedPizzaRouter,
};
