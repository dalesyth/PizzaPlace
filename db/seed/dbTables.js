const { client } = require("../index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        
        
        DROP TABLE IF EXISTS specialty_pizzas CASCADE;
        DROP TABLE IF EXISTS ordered_sides;
        DROP TABLE IF EXISTS side_options;
        DROP TABLE IF EXISTS pizza_toppings;
        DROP TABLE IF EXISTS ordered_pizza;
        DROP TABLE IF EXISTS crust_options;
        DROP TABLE IF EXISTS sauce_options;
        DROP TABLE IF EXISTS topping_options;
        DROP TABLE IF EXISTS orders CASCADE;
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
                user_id SERIAL PRIMARY KEY,
                first_name varchar(255) NOT NULL,
                last_name varchar(255) NOT NULL,
                password varchar(255),
                email varchar(255) NOT NULL,
                phone varchar(255),
                is_admin BOOLEAN DEFAULT FALSE
            );
        
        `);

    console.log("Users table created");

    await client.query(`
            CREATE TABLE orders (
                order_id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(user_id),
                order_date DATE,
                order_total NUMERIC,
                order_complete BOOLEAN DEFAULT FALSE
            );
        
        `);

    console.log("Orders table created");

    await client.query(`
            CREATE TABLE topping_options (
                topping_id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                image_name varchar(255)
            );
        `);

    console.log("Toppings table created");

    await client.query(`
            CREATE TABLE sauce_options (
                sauce_id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                image_name varchar(255)
            );
    `);

    console.log("Sauces table created");

    await client.query(`
            CREATE TABLE crust_options (
                crust_id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                image_name varchar(255)
            );
    
    `);

    console.log("Crusts table created");

    await client.query(`
              CREATE TABLE specialty_pizzas (
                pizza_id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                price NUMERIC NOT NULL
              )
    `);

    console.log("Specialty Pizzas table created");

    await client.query(`
            CREATE TABLE ordered_pizza (
                ordered_pizza_id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(order_id),
                pizza_price NUMERIC,
                quantity INTEGER,
                size varchar(255),
                crust INTEGER REFERENCES crust_options(crust_id),
                sauce INTEGER REFERENCES sauce_options(sauce_id),
                is_specialty BOOLEAN DEFAULT FALSE,
                specialty_pizza_id INTEGER REFERENCES specialty_pizzas(pizza_id)
                
            );
        `);

    console.log("Pizza Order table created");

    await client.query(`
            CREATE TABLE pizza_toppings (
                pizza_topping_id SERIAL PRIMARY KEY,
                topping_id INTEGER REFERENCES topping_options(topping_id),
                pizza_id INTEGER REFERENCES ordered_pizza(ordered_pizza_id)

            )
    `);

    console.log("Pizza Toppings table created");

    await client.query(`
              CREATE TABLE side_options (
                side_option_id SERIAL PRIMARY KEY,
                title varchar(255) UNIQUE NOT NULL,
                price NUMERIC NOT NULL
              )
    `);

    console.log("Side options table created");

    await client.query(`
              CREATE TABLE ordered_sides (
                ordered_side_id SERIAL PRIMARY KEY,
                side_id INTEGER REFERENCES side_options(side_option_id),
                order_id INTEGER REFERENCES orders(order_id),
                side_price NUMERIC,
                quantity NUMERIC
              )
    `);

    console.log("Ordered sides table created");

    
  } catch (error) {
    console.error("Error creating tables");
    throw error;
  }
}

module.exports = { dropTables, createTables };
