const express = require("express");
const saucesRouter = express.Router();
const { requireAdmin } = require("./utils");
const { getSauceById, getSauceByTitle, createSauce } = require("../db/sauces");
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

// GET /api/sauces/:sauceId

saucesRouter.get("/:sauceId", async (req, res, next) => {
    const { sauceId } = req.params;
    
    try {
        const sauce = await getSauceById(sauceId);

        if (!sauce || sauce.length === 0) {
            res.status(404).send("Sauce not found")
        } else {
            res.status(200).send(sauce)
        }


    } catch ({ name, message }) {
        next({ name, message })
    }
})

// GET /api/sauces/title/:title

saucesRouter.get("/title/:title", async (req, res, next) => {
    const { title } = req.params
    try {
        const sauce = getSauceByTitle(title);

        if (!sauce || sauce.length === 0) {
            res.status(404).send("Sauce not found")
        } else {
            res.status(200).send(sauce)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

// POST /api/sauces

saucesRouter.post("/", requireAdmin, async (req, res, next) => {
    const { title, imageName } = req.body
    try {
        const existingSauce = await getSauceByTitle(title);

        if (existingSauce) {
            res.status(400).send(`A sauce with title: ${title} already exists`)
        }

        const newSauce = await createSauce({ title, imageName });

        if (!newSauce || newSauce.length === 0) {
            res.status(404).send(`Failed to create new sauce: ${title}`)
        } else {
            res.status(200).send(newSauce)
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = {
  saucesRouter,
};
