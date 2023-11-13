const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { REACT_APP_JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;
const usersRouter = express.Router();
const cookieParser = require('cookie-parser')

const {
  getUserByEmail,
  createUser,
  getUser,
  getUserByUserId,
  deleteUser,
  guestUser,
  getAllUsers,
} = require("../db/users");
const { requireUser, requireAdmin } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.use(cookieParser());

// POST /api/users/guest

usersRouter.post("/guest", async (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  console.log("first_name from guest API endpoint:", first_name)
  console.log("last_name from guest API endpoint:", last_name);
  console.log("email from guest API endpoint:", email);
  try {
    if (!first_name) {
      res.status(400).send("Please enter a first name");
    }

    if (!last_name) {
      res.status(400).send("Please enter a last name");
    }

    if (!email) {
      res.status(400).send("Please enter an email");
    }

    const user = await guestUser({
      first_name,
      last_name,
      email,
    });

    console.log("user from guest api endpoint:", user)

    res.status(201).send(user);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register



usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, password, phone } = req.body;
  try {
    if (!password) {
      res.status(400).send("Please enter a password");
    }

    if (!email) {
      res.status(400).send("Please enter an email");
    }

    if (password.length < 8) {
      res.status(400).send("Password must be at least 8 characters");
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).send(`User already exists with email: ${email}`);
    }

    const user = await createUser({
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
        id: user.user_id,
        email: user.email,
        exp: expirationTime,
      },
      REACT_APP_JWT_SECRET
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).send({
      message: "Thank you for registering",
      token,
      user,
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
    return res
      .status(400)
      .send("Please provide both an email and password to log in");
  }

  try {
    const user = await getUser({ email, password });

    if (user) {
      const expirationTime =
        Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRATION_TIME);
      const token = jwt.sign(
        { id: user.user_id, email, exp: expirationTime },
        REACT_APP_JWT_SECRET
      );

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        domain: "localhost",
        path: "/",
      });

      console.log("token from api endpoint: ", token)

      // Send a success response with the user data
      return res.status(200).json({ message: "You are logged in!", user });
    } else {
      // Send an error response if login fails
      return res.status(401).json({
        message: "The email or password you have entered is incorrect",
        name: "IncorrectCredentialsError",
        error: "Email or password is incorrect",
      });
    }
  } catch (error) {
    // Handle other errors
    console.error({ name: error.name, message: error.message });
    next({ name: error.name, message: error.message });
  }
});

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  const user = req.user;
  console.log(`req.body from /me: ${Object.values(req.body)}`);
  console.log(`user from /me: ${user}`);

  try {
    res.send(user);
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users

usersRouter.get("/", async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    console.log("allUsers from api endpoint:", allUsers)
    res.status(200).send(allUsers);
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

// GET /api/users/:userId

usersRouter.get("/user/:userId", async (req, res, next) => {
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

// DELETE /api/users/:userId/delete

usersRouter.delete("/:userId/delete", async (req, res, next) => {
  const { userId } = req.params;
  console.log("you have reached the delete user api endpoint")
  try {
    const deletedUser = await deleteUser(userId);

    console.log("deletedUser from delete api enpoint:", deletedUser)

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

// POST /api/users/logout


usersRouter.get("/logout", (req, res) => {
  console.log("You have reached the logout api endpoint")
  // Clear the "token" cookie
  // res.clearCookie("token");

  // Optionally, you can send a response indicating successful logout
  // res.status(200).json({ message: "Logout successful" });

  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successfule" });
  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = usersRouter;
