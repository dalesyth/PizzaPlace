const express = require("express");
const saucesRouter = express.Router();
const { requireAdmin } = require("./utils");
const { getAllSauces } = require;

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

module.exports = {
  saucesRouter,
};
