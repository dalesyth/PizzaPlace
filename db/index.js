const { Client } = require("pg");

const client = new Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/pizza-place",
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Error connecting to PostgreSQL:", error));

module.exports = { client };
