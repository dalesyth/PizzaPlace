import { client } from "../index";

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS ingredient_category;
        DROP TABLE IF EXISTS category;
        DROP TABLE IF EXISTS pizza_order;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS users;
        
        `);

    console.log("Finished dropping tables");
  } catch (error) {
    console.error("Error dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                first_name varchar(255) NOT NULL,
                last_name varchar(255) NOT NULL,
                password varchar(255) NOT NULL,
                email varchar(255) UNIQUE NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            );
        
        `);

    console.log("Users table created");

    await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                order_total NUMERIC,
                order_complete BOOLEAN DEFAULT FALSE
            );
        
        `);

    console.log("Orders table created");

    await client.query(`
            CREATE TABLE ingredients (
                id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                image_name varchar(255)
            );
        `);

    console.log("Ingredients table created");

    await client.query(`
            CREATE TABLE pizza_order (
                id SERIAL PRIMARY KEY,
                ingredient_id INTEGER REFERENCES ingredients(id),
                order_id INTEGER REFERENCES orders(id),
                pizza_price NUMERIC,
                quantity INTEGER,
                size varchar(255)
            );
        `);

    console.log("Pizza Order table created");

    await client.query(`
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                title varchar(255)
            );
        
        `);

    console.log("Categories table created");

    await client.query(`
            CREATE TABLE ingredient_category (
                id SERIAL PRIMARY KEY,
                ingredient_id INTEGER REFERENCES ingredients(id),
                category_id INTEGER REFERENCES category(id)

            );
        
        `);

    console.log("Ingredient category table created");
  } catch (error) {
    console.error("Error creating tables");
    throw error;
  }
}

export { dropTables, createTables };
