const express = require("express");
const crustsRouter = express.Router();
const { requireAdmin } = require("./utils");
const { getAllCrusts } = require("../db/crusts");

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

module.exports = {
  crustsRouter,
};
