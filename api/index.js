const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUserId } = require("../db/users");
const { REACT_APP_JWT_SECRET } = process.env;

//JWT Authorization Middleware

apiRouter.use(async (req, res, next) => {
  console.log("You have reached the JWT auth middleware");
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  console.log(`auth: ${auth}`);

  if (!auth) {
    console.log("!auth");
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      console.log("You have reached the try/catch to verify the JWT");
      const { id } = jwt.verify(token, REACT_APP_JWT_SECRET);

      console.log(`id from auth: ${id}`);

      if (id) {
        req.user = await getUserByUserId(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  console.log("You have reached middleware to check req.user");
  console.log(`req.user from middleware: ${req.user}`);
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

// ROUTER: /api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// ROUTE: /api/orders
const ordersRouter = require("./orders");
apiRouter.use("/orders", ordersRouter);

// ROUTE: /api/toppings
const toppingsRouter = require("./toppings");
apiRouter.use("/toppings", toppingsRouter);

// ROUTE: /api/sauces
const saucesRouter = require("./sauces");
apiRouter.use("/sauces", saucesRouter);

// ROUTE: /api/crusts
const crustsRouter = require("./crusts");
apiRouter.use("/crusts", crustsRouter);

// ROUTE: /api/ordered-pizza
const orderedPizzaRouter = require("./orderedpizzas");
apiRouter.use("/ordered-pizza", orderedPizzaRouter);

// ROUTE: /api/sides
const sidesRouter = require("./sides");
apiRouter.use("/sides", sidesRouter);

// ROUTE: /api/specialty-pizza
const specialtyPizzaRouter = require("./specialtypizzas");
apiRouter.use("/specialty-pizza", specialtyPizzaRouter);

// ERROR HANDLER
apiRouter.use((error, req, res, next) => {
  res.status(500).send({
    name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;
