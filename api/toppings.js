const express = require("express");
const {
  getAllToppings,
  getToppingById,
  getToppingByTitle,
  getToppingsByOrderedPizza,
  attachToppingToOrderedPizza,
} = require("../db/toppings");
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

// GET /api/toppings/title/:title

toppingsRouter.get("/title/:title", async (req, res, next) => {
  const { title } = req.params;

  try {
    const topping = await getToppingByTitle(title);

    if (!topping || topping.length === 0) {
      res.status(404).send("Topping not found");
    } else {
      res.status(200).send(topping);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//GET /api/toppings/:orderedPizzaId/orderedPizza

toppingsRouter.get("/:orderedPizzaId/orderedPizza", async (req, res, next) => {
    const { orderedPizzaId } = req.params;

    try {
        const toppings = await getToppingsByOrderedPizza(orderedPizzaId);

        if (!toppings || toppings.length === 0) {
            res.status(404).send('Toppings not found')
        } else {
            res.status(200).send(toppings)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// PATCH /api/toppings/:pizzaId/orderedPizza

toppingsRouter.patch("/:pizzaId/orderedPizza", async (req, res, next) => {
    const { pizzaId } = req.params
    const { toppingId } = req.body
    try {
        const topping = await attachToppingToOrderedPizza({ toppingId, pizzaId });

        if (topping) {
            res.status(200).send('Topping added to pizza')
        } else {
            res.status(404).send('Failed to add topping to pizza')
        }


    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = {
  toppingsRouter,
};
