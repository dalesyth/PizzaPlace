require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your actual client origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
const apiRouter = require("./api/index");
app.use("/api", apiRouter);

// CORS Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your actual client origin
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Handle Preflight Requests
app.options(
  "*",
  cors({
    origin: "http://localhost:5173", // Replace with your actual client origin
    credentials: true,
  })
);

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});
