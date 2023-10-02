const express = require("express");
const crustsRouter = express.Router();
const { requireAdmin } = require("./utils");
const {
  getAllCrusts,
  getCrustById,
  getCrustByTitle,
  createCrust,
  addCrustToOrderedPizza,
  removeCrustFromOrderedPizza,
  updateCrust,
  deleteCrust,
} = require("../db/crusts");

crustsRouter.use((req, res, next) => {
  console.log("A request is being made to /crusts");

  next();
});

// GET /api/crusts

crustsRouter.get("/", async (req, res, next) => {
  try {
    const crusts = await getAllCrusts();

    if (!crusts || crusts.length === 0) {
      res.status(404).send("Error getting crust info");
    } else {
      res.status(200).send(crusts);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/crusts/:crustId

crustsRouter.get("/:crustId", async (req, res, next) => {
  const { crustId } = req.params;
  try {
    const crust = await getCrustById(crustId);

    if (!crust || crust.length === 0) {
      res.status(404).send("Crust not found");
    } else {
      res.status(200).send(crust);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/crusts/title/:title

crustsRouter.get("/title/:title", async (req, res, next) => {
  const { title } = req.params;
  try {
    const crust = await getCrustByTitle(title);

    if (!crust || crust.length === 0) {
      res.status(404).send("Crust not found");
    } else {
      res.status(200).send(crust);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/crusts

crustsRouter.post("/", requireAdmin, async (req, res, next) => {
  const { title, imageName } = req.body;
  try {
    const existingCrust = await getCrustByTitle(title);

    if (existingCrust) {
      res.status(400).send(`A crust with title: ${crust} already exists`);
    }

    const newCrust = await createCrust({ title, imageName });

    if (!newCrust || newCrust.length === 0) {
      res.status(404).send(`Failed to create new crust: ${title}`);
    } else {
      res.status(200).send(newCrust);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/crusts/:orderedPizzaId/addCrust

crustsRouter.patch("/:orderedPizzaId/addCrust", async (req, res, next) => {
  const { orderedPizzaId } = req.params;
  const { crustId } = req.body;
  try {
    const crust = await addCrustToOrderedPizza({ crustId, orderedPizzaId });

    if (!crust || crust.length === 0) {
      res.status(404).send("Failed to add crust to pizza");
    } else {
      res.status(200).send("Crust added to pizza");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/crusts/:orderedPizzaId/removeCrust

crustsRouter.patch("/:orderedPizzaId/remvoveCrust", async (req, res, next) => {
  const { orderedPizzaId } = req.params;
  const { crustId } = req.body;
  try {
    const crust = await removeCrustFromOrderedPizza({
      crustId,
      orderedPizzaId,
    });

    if (crust) {
      res.status(200).send("Crust removed from pizza");
    } else {
      res.status(404).send("Failed to remove crust from pizza");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/crusts/:crustId/updateCrust

crustsRouter.patch(
  "/:crustId/updateCrust",
  requireAdmin,
  async (req, res, next) => {
    const { crustId } = req.params;
    const { title, imageName } = req.body;
    try {
      const existingCrust = await getCrustByTitle(title);

      if (!existingCrust || existingCrust.length === 0) {
        res.status(404).send(`Crust ${title} not found`);
      }

      const updatedCrust = await updateCrust({ crustId, title, imageName });

      if (updatedCrust) {
        res.status(200).send(updatedCrust);
      } else {
        res.status(404).send(`Failed to update crust: ${title}`);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// DELETE /api/crusts/:crustId

crustsRouter.delete("/:crustId", requireAdmin, async (req, res, next) => {
  const { crustId } = req.params;
  try {
    const deletedCrust = await deleteCrust(crustId);

    if (deletedCrust) {
      res.status(200).send(`Crust ${deletedCrust.title} has been deleted`);
    } else {
      res.status(404).send("Failed to delete crust");
    }
  } catch ({ name, message }) {
    next([name, message]);
  }
});

module.exports = crustsRouter;
