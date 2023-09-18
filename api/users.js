const express = require('express')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const { REACT_APP_JWT_SCRET } = process.env;
const usersRouter = express.Router();



module.exports = {
    usersRouter
}