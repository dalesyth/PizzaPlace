const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { REACT_APP_JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;
const usersRouter = express.Router();

const {
  getUserByEmail,
  createUser,
  getUser,
  getUserByUserId,
  deleteUser,
} = require("../db/users");
const { requireUser, requireAdmin } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

// POST /api/users/register

usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, password, phone } = req.body;
  try {
    if (password.length < 8) {
      res.status(400).send("Password must be at least 8 characters");
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).send(`User already exists with email: ${email}`);
    }

    const newUser = await createUser({
      first_name,
      last_name,
      password,
      email,
      phone,
    });

    const expirationTime =
      Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRATION_TIME);

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        exp: expirationTime,
      },
      REACT_APP_JWT_SECRET
    );

    res.status(201).send({
      message: "Thank you for registering",
      token,
      email,
    });
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// POST /api/users/login

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Please provide both an email and password to log in");
  }

  try {
    const user = await getUser({ email, password });

    if (user) {
      const token = jwt.sign({ id: user.id, email }, REACT_APP_JWT_SCRET);

      res.status(200).send({ message: "You are logged in!", token, user });
    } else {
      next({
        message: "The email or password you have entered is incorrect",
        name: "IncorrectCredentialsError",
        error: "Email or password is incorrect",
      });
    }
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  const user = req.user;

  try {
    res.send(user);
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users

usersRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.status(200).send(allUsers);
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users/:userId

usersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserByUserId(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users/useremail/:userEmail

usersRouter.get("/useremail/:email", async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// DELETE /api/user/:userId

usersRouter.delete("/:userId", requireAdmin, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const deletedUser = await deleteUser(userId);

    if (deletedUser) {
      res.status(200).send("User has been deleted");
    } else {
      res.status(404).send("User not found or deletion failed");
    }
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

module.exports = usersRouter;
