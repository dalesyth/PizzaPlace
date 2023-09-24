const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { REACT_APP_JWT_SCRET, JWT_EXPIRATION_TIME } = process.env;
const usersRouter = express.Router();
const { getUserByEmail, createUser } = require("../db/users");

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

usersRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        next({
            message: "Please provide both an email and password to log in",
            name: "MissingCredentialsError",
            error: "Please provide both an email and password to log in",
        });
    }

    try {
        
    } catch ({ name, message }) {
        console.error({ name, message });
        next({ name, message })
    }
})

module.exports = {
  usersRouter,
};
