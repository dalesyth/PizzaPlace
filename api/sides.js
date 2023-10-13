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
})