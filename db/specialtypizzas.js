const { client } = require("./index");
const { getToppingsForSpecialtyPizza } = require("./toppings");

async function createSpecialtyPizza({ ...fields }) {
  const dataArray = Object.values(fields);
  let columnNames = Object.keys(fields)
    .map((key) => `"${key}"`)
    .join(", ");
  let valuePlaceHolders = Object.keys(fields)
    .map((keys, index) => {
      return `$${index + 1}`;
    })
    .join(", ");

  const newOrderSQL = `
    INSERT INTO specialty_pizzas
    (${columnNames})
    VALUES(${valuePlaceHolders})
    RETURNING *;
    `;

  try {
    const {
      rows: [orderedPizza],
    } = await client.query(newOrderSQL, dataArray);
    return orderedPizza;
  } catch (error) {
    console.error("Error creating ordered pizza: ", error);
    throw error;
  }
}

async function updateSpecialtyPizza(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
        UPDATE specialty_pizzas
        SET ${setString}
        WHERE pizza_id=$${dataArray.length + 1}
        RETURNING *;
    `;
  dataArray.push(id);

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [specialtyPizza],
    } = await client.query(sql, dataArray);
    return specialtyPizza;
  } catch (error) {
    console.error("Error updating specialty pizza: ", error);
    throw error;
  }
}

async function getAllSpecialtyPizzas() {
  try {
    const { rows: pizzas } = await client.query(
      `
        SELECT specialty_pizzas.title AS "pizzaName",
        specialty_pizzas.price AS "pizzaPrice",
        specialty_pizzas.pizza_id AS "pizza_id",
        crust_options.title AS "crustName",
        sauce_options.title AS "sauceName"
        FROM specialty_pizzas
        JOIN ordered_pizza ON specialty_pizzas.pizza_id = ordered_pizza.specialty_pizza_id
        JOIN crust_options ON crust_id = ordered_pizza.crust
        JOIN sauce_options ON sauce_id = ordered_pizza.sauce
        
        
      `
    );

    const pizzasWithToppings = await getToppingsForSpecialtyPizza(pizzas);
    return pizzasWithToppings;
  } catch (error) {
    console.error("Error getting all specialty pizzas: ", error);
    throw error;
  }
}

async function getSpecialtyPizzaByPizzaId(pizza_id) {
  try {
    const {
      rows: [specialtyPizza],
    } = await client.query(
      `
            SELECT specialty_pizzas.*, pizza_toppings.*, crust_options.*, sauce_options.*, topping_options.*
            FROM specialty_pizzas
            LEFT JOIN ordered_pizza ON ordered_pizza.specialty_pizza_id = specialty_pizzas.pizza_id
            LEFT JOIN pizza_toppings ON pizza_toppings.pizza_id = ordered_pizza.ordered_pizza_id
            LEFT JOIN crust_options ON crust_options.crust_id = ordered_pizza.crust
            LEFT JOIN sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
            LEFT JOIN topping_options ON topping_options.topping_id = pizza_toppings.topping_id
            WHERE specialty_pizzas.pizza_id = $1

        `,
      [pizza_id]
    );
    return specialtyPizza;
  } catch (error) {
    console.error("Error getting specialty pizza by pizza id: ", error);
    throw error;
  }
}

async function getSpecialtyPizzaByUser(user_id) {
  try {
    const { rows } = await client.query(`
            SELECT specialty_pizzas.*, pizza_toppings.*, crust_options.*, sauce_options.*, topping_options.*
            FROM specialty_pizzas
            LEFT JOIN ordered_pizza ON ordered_pizza.specialty_pizza_id = specialty_pizzas.pizza_id
            LEFT JOIN orders ON orders.order_id = ordered_pizza.order_id
            LEFT JOIN users ON users.user_id = orders.user_id
            LEFT JOIN pizza_toppings ON pizza_toppings.pizza_id = ordered_pizza.ordered_pizza_id
            LEFT JOIN crust_options ON crust_options.crust_id = ordered_pizza.crust
            LEFT JOIN sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
            LEFT JOIN topping_options ON topping_options.topping_id = pizza_toppings.topping_id
            WHERE users.user_id = $1

        
        `);

    return rows;
  } catch (error) {
    console.error("Error getting specialty pizzas by user id: ", error);
  }
}

async function getSpecialtyPizzaByOrderId(order_id) {
  try {
    const { rows } = await client.query(
      `
            SELECT specialty_pizzas.*
            FROM ordered_pizza
            JOIN specialty_pizzas ON ordered_pizza.specialty_pizza_id = specialty_pizzas.pizza_id
            WHERE ordered_pizza.order_id = $1
        `,
      [order_id]
    );

    return rows;
  } catch (error) {
    console.error("Error getting specialty pizzas by order id: ", error);
    throw error;
  }
}

async function deleteSpecialtyPizza(pizza_id) {
  try {
    const {
      rows: [deletedPizza],
    } = await client.query(
      `
            DELETE FROM specialty_pizzas
            WHERE pizza_id = $1
        `,
      [pizza_id]
    );

    return deletedPizza;
  } catch (error) {
    console.error("Error deleting specialty pizza: ", error);
    throw error;
  }
}

module.exports = {
  getAllSpecialtyPizzas,
  getSpecialtyPizzaByOrderId,
  getSpecialtyPizzaByPizzaId,
  getSpecialtyPizzaByUser,
  deleteSpecialtyPizza,
  createSpecialtyPizza,
  updateSpecialtyPizza,
};
