const { client } = require("./index");
const { getToppingsByOrderedPizza } = require("./toppings");

async function createOrderedPizza({ ...fields }) {
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
    INSERT INTO ordered_pizza
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

async function updateOrderedPizza(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
        UPDATE ordered_pizza
        SET ${setString}
        WHERE ordered_pizza_id=$${dataArray.length + 1}
        RETURNING *;
    `;
  dataArray.push(id);

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [orderedPizza],
    } = await client.query(sql, dataArray);
    return orderedPizza;
  } catch (error) {
    console.error("Error updating ordered pizza: ", error);
    throw error;
  }
}

async function getOrderedPizzaByPizzaId(ordered_pizza_id) {
  
  try {
    const {
      rows: [orderedPizza],
    } = await client.query(
      `
                SELECT ordered_pizza.*, pizza_toppings.*, crust_options.*, sauce_options.*, topping_options.*
                FROM ordered_pizza
                LEFT JOIN pizza_toppings ON pizza_toppings.pizza_id = ordered_pizza.ordered_pizza_id
                LEFT JOIN crust_options ON crust_options.crust_id = ordered_pizza.crust
                LEFT JOIN sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
                LEFT JOIN topping_options ON topping_options.topping_id = pizza_toppings.topping_id
                WHERE ordered_pizza.ordered_pizza_id = $1
            `,
      [ordered_pizza_id]
    );
    
    return orderedPizza;
  } catch (error) {
    console.error("Error getting ordered pizza by pizza id: ", error);
    throw error;
  }
}

async function getOrderedPizzasByUser(user_id) {
  try {
    const { rows } = await client.query(
      `
                SELECT ordered_pizza.*, pizza_toppings.*, crust_options.*, sauce_options.*, topping_options.*
                FROM ordered_pizza
                JOIN orders ON orders.order_id = ordered_pizza.order_id
                JOIN users ON users.user_id = orders.user_id
                JOIN pizza_toppings ON pizza_toppings.pizza_id = ordered_pizza.ordered_pizza_id
                JOIN crust_options ON crust_options.crust_id = ordered_pizza.crust
                JOIN sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
                LEFT JOIN topping_options ON topping_options.topping_id = pizza_toppings.topping_id
                WHERE users.user_id = $1
            `,
      [user_id]
    );

    return rows;
  } catch (error) {
    console.error("Error get ordered pizza by user: ", error);
    throw error;
  }
}

async function getOrderedPizzasByOrderId(order_id) {
  
  try {
    const { rows: pizzas } = await client.query(
      `
        SELECT
          ordered_pizza.ordered_pizza_id AS ordered_pizza_id,
          ordered_pizza.title AS title,
          ordered_pizza.pizza_price AS price,
          crust_options.title AS "crustName",
          crust_options.crust_id AS "crustId",
          sauce_options.title AS "sauceName",
          sauce_options.sauce_id AS "sauceId"
        FROM
          ordered_pizza
        JOIN
          orders ON orders.order_id = ordered_pizza.order_id
        JOIN
          users ON users.user_id = orders.user_id
        JOIN
          crust_options ON crust_options.crust_id = ordered_pizza.crust
        JOIN
          sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
        WHERE
          ordered_pizza.order_id = $1;
      `,
      [order_id]
    );

    // Attach toppings to each ordered pizza
    const pizzasWithToppings = await Promise.all(
      pizzas.map(async (pizza) => {
        const toppings = await getToppingsByOrderedPizza(
          pizza.ordered_pizza_id
        );
        return { ...pizza, toppings: toppings };
      })
    );

    return pizzasWithToppings;
  } catch (error) {
    console.error("Error getting ordered pizzas by order id: ", error);
    throw error;
  }
}

async function deleteOrderedPizza(ordered_pizza_id) {
  try {
    await client.query(
      `
            DELETE FROM pizza_toppings
            WHERE pizza_id = $1
            
            `,
      [ordered_pizza_id]
    );

    const {
      rows: [deletedPizza],
    } = await client.query(
      `
            DELETE FROM ordered_pizza
            WHERE ordered_pizza_id = $1
            RETURNING *
            `,
      [ordered_pizza_id]
    );

    return deletedPizza;
  } catch (error) {
    console.error("Error deleting ordered pizza: ", error);
    throw error;
  }
}

module.exports = {
  getOrderedPizzaByPizzaId,
  getOrderedPizzasByUser,
  getOrderedPizzasByOrderId,
  createOrderedPizza,
  updateOrderedPizza,
  deleteOrderedPizza,
};
