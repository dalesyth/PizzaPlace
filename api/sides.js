const express = require("express");
const {
  createSide,
  updateSide,
  getAllSides,
  getSideById,
  getSideByTitle,
  getSidesByOrder,
  attachSideToOrder,
  removeSideFromOrder,
  deleteSide,
} = require("../db/sides");
const sidesRouter = express.Router();
const { requireAdmin } = require("./utils");

sidesRouter.use((req, res, next) => {
  console.log("A request is being made to /sides");

  next();
});

// GET /api/sides

sidesRouter.get("/", async (req, res, next) => {
  try {
    const sides = await getAllSides();
    if (!sides || sides.length === 0) {
      res.status(404).send("Sides not found");
    } else {
      res.status(200).send(sides);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/sides/:sideId

sidesRouter.get("/:sideId", async (req, res, next) => {
  const { sideId } = req.params;

  try {
    const side = await getSideById(sideId);

    if (!side) {
      res.status(404).send("Side not found");
    } else {
      res.status(200).send(side);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/sides/title/:title

sidesRouter.get("/title/:title", async (req, res, next) => {
  const { title } = req.params;

  try {
    const side = await getSideByTitle(title);

    if (!side) {
      res.status(404).send("Side not found");
    } else {
      res.status(200).send(side);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/sides/:orderId/ordered-sides
// Gets all sides associated with an order

sidesRouter.get("/:orderId/ordered-sides", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const sides = await getSidesByOrder(orderId);

    if (!sides || sides.length === 0) {
      res.status(404).send("Sides not found");
    } else {
      res.status(200).send(sides);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/sides

sidesRouter.post("/", requireAdmin, async (req, res, next) => {
  const { title, price } = req.body;

  try {
    const existingSide = await getSideByTitle(title);

    if (existingSide) {
      res.status(400).send(`A side with title: ${title} already exists`);
    }

    const newSide = await createSide({ title, price });

    if (newSide) {
      res.status(200).send(newSide);
    } else {
      res.status(404).send(`Failed to create new topping: ${title}`);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sides/:orderId/add-side
// Adds side to an order

sidesRouter.patch("/:orderId/add-side", async (req, res, next) => {
  const { orderId } = req.params;
  const { sideId, sidePrice } = req.body;
  

  try {
    const side = await attachSideToOrder({ sideId, orderId, sidePrice });

    if (!side) {
      res.status(404).send("Failed to add side to order");
    } else {
      res.status(200).send(side);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sides/:orderId/remove-side
// Removes side from order

sidesRouter.patch("/:orderId/remove-side", async (req, res, next) => {
  const { orderId } = req.params;
  const { sideId } = req.body;

  try {
    const side = await removeSideFromOrder({ sideId, orderId });

    if (!side) {
      res.status(404).send("Failed to remove side from order");
    } else {
      res.status(200).send(side);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/sides/:sideId/update-side

sidesRouter.patch(
  "/:sideId/update-side",
  requireAdmin,
  async (req, res, next) => {
    const { sideId } = req.params;
    const { title, price } = req.body;

    try {
      const existingSide = await getSideById(id);

      if (!existingSide) {
        res.status(404).send("This side does not exist");
      }

      const updatedSide = await updateSide({ sideId, title, price });

      if (updatedSide) {
        res.status(200).send(updateSide);
      } else {
        res.status(404).send(`Failed to update side`);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// DELETE /api/sides/:sideId

sidesRouter.delete("/:sideId", requireAdmin, async (req, res, next) => {
  const { sideId } = req.params;

  try {
    const deletedSide = await deleteSide(sideId);

    if (deletedSide) {
      res.status(200).send(`Side ${deletedSide.title} has been deleted`);
    } else {
      res.status(404).send("Failed to delete side");
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = sidesRouter;
