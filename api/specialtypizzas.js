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

// GET /api/specialty-pizza

specialtyPizzaRouter.get("/", async (req, res, next) => {
  try {
    
    const pizzas = await getAllSpecialtyPizzas();

    

    if (!pizzas || pizzas.length === 0) {
      res.status(404).send("Error getting all specialty pizzas");
    } else {
      res.status(200).send(pizzas);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});








module.exports=specialtyPizzaRouter