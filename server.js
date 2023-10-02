require("dotenv").config();
const express = require("express");
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const apiRouter = require("./api/index");
app.use("/api", apiRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});
