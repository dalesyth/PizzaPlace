const express = require("express");
const {
  getAllToppings,
  getToppingById,
  getToppingByTitle,
  getToppingsByOrderedPizza,
  attachToppingToOrderedPizza,
  removeToppingFromOrderedPizza,
  deleteTopping,
  createTopping,
  updateTopping,
} = require("../db/toppings");
const toppingsRouter = express.Router();
const { requireAdmin } = require("./utils")

toppingsRouter.use((req, res, next) => {
  console.log("A request is being made to /toppings");

  next();
});

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

    if (!topping) {
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

    if (!topping) {
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
      res.status(404).send("Toppings not found");
    } else {
      res.status(200).send(toppings);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/toppings

toppingsRouter.post("/", requireAdmin, async (req, res, next) => {
  const { title, imageName } = req.body;

  try {
    const existingTopping = await getToppingByTitle(title);

    if (existingTopping) {
      res.status(400).send(`A topping with title: ${title} already exists`);
    }

    const newTopping = await createTopping({ title, imageName });

    if (newTopping) {
      res.status(200).send(newTopping);
    } else {
      res.status(404).send(`Failed to create new topping: ${title}`);
    }
  } catch ({ name, message }) {
    next([name, message]);
  }
});

// PATCH /api/toppings/:pizzaId/addTopping

toppingsRouter.patch("/:pizzaId/addTopping", async (req, res, next) => {
  const { pizzaId } = req.params;
  const { toppingId } = req.body;
  try {
    const topping = await attachToppingToOrderedPizza({ toppingId, pizzaId });

    // if (topping) {
    //   res.status(200).send(topping);
    // } else {
    //   res.status(404).send("Failed to add topping to pizza");
    // }

    if (!topping || topping.length === 0) {
      res.status(404).send("Failed to add topping to pizza")
    } else {
      res.status(200).send(topping);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/toppings/:pizzaId/removeTopping

toppingsRouter.patch("/:pizzaId/removeTopping", async (req, res, next) => {
  const { pizzaId } = req.params;
  const { toppingId } = req.body;
  try {
    const topping = await removeToppingFromOrderedPizza({ toppingId, pizzaId });

    if (topping) {
      res.status(200).send("Topping removed from pizza");
    } else {
      res.status(404).send("Failed to remove topping from pizza");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/toppings/:toppingId/updateTopping

toppingsRouter.patch("/:toppingId/updateTopping", requireAdmin, async (req, res, next) => {
  const { toppingId } = req.params;
  const { title, imageName } = req.body;
  try {
    const existingTopping = await getToppingByTitle(title);

    if (!existingTopping || existingTopping.length === 0) {
      res.status(404).send(`Topping ${title} not found`);
    }

    const updatedTopping = await updateTopping({ toppingId, title, imageName });

    if (updatedTopping) {
      res.status(200).send(updatedTopping);
    } else {
      res.status(404).send(`Failed to update topping: ${title}`);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/toppings/:toppingId

toppingsRouter.delete("/:toppingId", requireAdmin, async (req, res, next) => {
  const { toppingId } = req.params;
  try {
    const deletedTopping = await deleteTopping(toppingId);

    if (deletedTopping) {
      res.status(200).send(`Topping ${deletedTopping.title} has been deleted`);
    } else {
      res.status(404).send("Failed to delete topping");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = toppingsRouter;
