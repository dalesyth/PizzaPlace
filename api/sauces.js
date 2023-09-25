const express = require("express");
const saucesRouter = express.Router();
const { requireAdmin } = require("./utils");
const {
  getAllSauces,
  getSauceById,
  getSauceByTitle,
  createSauce,
  addSauceToOrderedPizza,
  removeSauceFromOrderedPizza,
  updateSauce,
  deleteSauce,
} = require("../db/sauces");


// GET /api/sauces

saucesRouter.get("/", async (req, res, next) => {
  try {
    const sauces = await getAllSauces();

    if (!sauces || sauces.length === 0) {
      res.status(404).send("Error getting all sauces");
    } else {
      res.status(200).send(sauces);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/sauces/:sauceId

saucesRouter.get("/:sauceId", async (req, res, next) => {
  const { sauceId } = req.params;

  try {
    const sauce = await getSauceById(sauceId);

    if (!sauce || sauce.length === 0) {
      res.status(404).send("Sauce not found");
    } else {
      res.status(200).send(sauce);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/sauces/title/:title

saucesRouter.get("/title/:title", async (req, res, next) => {
  const { title } = req.params;
  try {
    const sauce = getSauceByTitle(title);

    if (!sauce || sauce.length === 0) {
      res.status(404).send("Sauce not found");
    } else {
      res.status(200).send(sauce);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/sauces

saucesRouter.post("/", requireAdmin, async (req, res, next) => {
  const { title, imageName } = req.body;
  try {
    const existingSauce = await getSauceByTitle(title);

    if (existingSauce) {
      res.status(400).send(`A sauce with title: ${title} already exists`);
    }

    const newSauce = await createSauce({ title, imageName });

    if (!newSauce || newSauce.length === 0) {
      res.status(404).send(`Failed to create new sauce: ${title}`);
    } else {
      res.status(200).send(newSauce);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sauces/:orderedPizzaId/addSauce

saucesRouter.patch("/:orderedPizzaId/addSauce", async (req, res, next) => {
  const { orderedPizzaId } = req.params;
  const { sauceId } = req.body;
  try {
    const sauce = await addSauceToOrderedPizza({ sauceId, orderedPizzaId });

    if (!sauce || sauce.length === 0) {
      res.status(404).send("Failed to add sauce to pizza");
    } else {
      res.status(200).send("Sauce added to pizza");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sauces/:orderedPizzaId/removeSauce

saucesRouter.patch("/:orderedPizzaId/removeSauce", async (req, res, next) => {
  const { orderedPizzaId } = req.params;
  const { sauceId } = req.body;

  try {
    const sauce = await removeSauceFromOrderedPizza({
      sauceId,
      orderedPizzaId,
    });

    if (sauce) {
      res.status(200).send("Sauce removed from pizza");
    } else {
      res.status(404).send("Failed to remove sauce from pizza");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sauces/:sauceId/updateSauce

saucesRouter.patch(
  "/:sauceId/updateSauce",
  requireAdmin,
  async (req, res, next) => {
    const { sauceId } = req.params;
    const { title, imageName } = req.body;
    try {
      const existingSauce = await getSauceByTitle(title);

      if (!existingSauce || existingSauce.length === 0) {
        res.status(404).send(`Sauce ${title} not found`);
      }

      const updatedSauce = await updateSauce({ sauceId, title, imageName });

      if (updatedSauce) {
        res.status(200).send(updatedSauce);
      } else {
        res.status(404).send(`Failed to update topping: ${title}`);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// DELETE /api/sauces/:sauceId

saucesRouter.delete("/:sauceId", requireAdmin, async (req, res, next) => {
  const { sauceId } = req.params;
  try {
    const deletedSauce = await deleteSauce(sauceId);

    if (deletedSauce) {
      res.status(200).send(`Sauce ${deletedSauce.title} has been deleted`);
    } else {
      res.status(404).send("Failed to delete sauce");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = {
  saucesRouter,
};
