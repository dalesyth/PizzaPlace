require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apiRouter = require("./api/index")


const app = express();



app.use(morgan('tiny'));

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);


const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port: ${SERVER_PORT}`);
});