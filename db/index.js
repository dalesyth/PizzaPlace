// Import the pg library
const { Client } = require("pg");

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: "postgres://localhost:5432/pizza-place",
});

// Connect to the PostgreSQL database
client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Error connecting to PostgreSQL:", error));

// Export the client for use in other parts of your application
module.exports = { client };
