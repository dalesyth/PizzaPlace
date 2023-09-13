// import { client } from "../index"
// import { rebuildDB } from "./rebuildDB";
const { client } = require("../index")
const { rebuildDB } = require("./rebuildDB")

rebuildDB()
    .catch(console.error)
    .finally(() => client.end())