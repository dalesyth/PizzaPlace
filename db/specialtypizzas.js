const { client } = require("./index");

async function createSpecialtyPizza({ ...fields }) {
  const dataArray = Object.values(fields);
  let columnNames = Object.keys(fields)
    .map((key) => `"${key}`)
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
      rows: [specialtyPizza],
    } = await client.query(newOrderSQL, dataArray);
    return specialtyPizza;
  } catch (error) {
    console.error("Error creating specialty pizza: ", error);
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

async function getSpecialtyPizzaByPizzaId(pizza_id) {
    try {
        const {
            rows: [specialtyPizza],
        } = await client.query(`
            SELECT specialty_pizzas.*, pizza_toppings.*, crust_options.*, sauce_options.*
            FROM specialty_pizzas
            LEFT JOIN ordered_pizza ON ordered_pizza.specialty_pizza_id = specialty_pizzas.pizza_id
            LEFT JOIN pizza_toppings ON pizza_toppings.pizza_id = ordered_pizza.ordered_pizza_id
            LEFT JOIN crust_options ON crust_options.crust_id = ordered_pizza.crust
            LEFT JOIN sauce_options ON sauce_options.sauce_id = ordered_pizza.sauce
            LEFT JOIN topping_options ON topping_options.topping_id = pizza_toppings.topping_id
            WHERE specialty_pizzas.pizza_id = $1

        `, [pizza_id]);
        return specialtyPizza;
    } catch (error) {
        console.error("Error getting specialty pizza by pizza id: ", error);
        throw error;
    }
}