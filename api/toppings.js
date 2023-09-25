const express = require("express");
const { getAllToppings, getToppingById } = require("../db/toppings");
const toppingsRouter = express.Router();

// GET /api/toppings

toppingsRouter.get("/", async (req, res, next) => {
  try {
    const toppings = await getAllToppings();
    if (!toppings || toppings.length === 0) {
      res.status(404).send("Toppings not found");
    } else {
      res.status(200).send(toppings);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/toppings/:toppingId

toppingsRouter.get("/:toppingId", async (req, res, next) => {
  const { toppingId } = req.params;

  try {
    const topping = await getToppingById(toppingId);

    if (!topping || topping.length === 0) {
      res.status(404).send("Topping not found");
    } else {
      res.status(200).send(topping);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = {
  toppingsRouter,
};
