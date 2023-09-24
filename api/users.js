const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { REACT_APP_JWT_SCRET, JWT_EXPIRATION_TIME } = process.env;
const usersRouter = express.Router();
const { getUserByEmail, createUser, getUser } = require("../db/users");

// POST /api/users/register

usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, password, phone } = req.body;
  try {
    if (password.length < 8) {
      next({
        message: "Password must be at least 8 characters",
        name: "PasswordTooShortError",
        error: "Password Too Short",
      });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      next({
        message: `User already exists with email: ${email}`,
      });
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
      REACT_APP_JWT_SCRET
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
    next({
      message: "Please provide both an email and password to log in",
      name: "MissingCredentialsError",
      error: "Please provide both an email and password to log in",
    });
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
        console.error({ name, message })
        next({ name, message })
    }
})

// GET /api/users

usersRouter.get("/", async (req, res, next) => {
    try {
        const allUsers = await getAllUsers()
        res.status(200).send(allUsers);
    } catch ({ name, message }) {
        console.error({ name, message })
        next({ name, message })
    }
})


module.exports = {
  usersRouter,
};
