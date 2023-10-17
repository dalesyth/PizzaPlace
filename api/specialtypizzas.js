const express = require("express");
const {
  getAllSpecialtyPizzas,
  getSpecialtyPizzaByOrderId,
  getSpecialtyPizzaByPizzaId,
  getSpecialtyPizzaByUser,
  deleteSpecialtyPizza,
  createSpecialtyPizza,
  updateSpecialtyPizza,
} = require("../db/specialtypizzas");
const specialtyPizzaRouter = express.Router();


specialtyPizzaRouter.use((req, res, next) => {
    console.log("A request is being made to /specialty-pizza");

    next();
});








module.exports=specialtyPizzaRouter