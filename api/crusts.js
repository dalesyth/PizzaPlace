const express = require("express");
const crustsRouter = express.Router();
const { requireAdmin } = require("./utils");
const { getAllCrusts, getCrustById, getCrustByTitle } = require("../db/crusts");

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

module.exports = {
  crustsRouter,
};
