// import { dropTables, createTables } from "./dbtables";
// import { populateDB } from "./seedData";
const { dropTables, createTables } = require("./dbTables")
const { populateDB } = require("./seedData")

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await populateDB();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

// export { rebuildDB };
module.exports = { rebuildDB }
