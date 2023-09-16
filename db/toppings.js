const { client } = require("./index");

async function createTopping({ title, image_name }) {
  try {
    const {
      rows: [topping],
    } = await client.query(
      `
            INSERT INTO topping_options (title, image_name)
            VALUES ($1, $2)
            RETURNING *;
            `,
      [title, image_name]
    );

    return topping;
  } catch (error) {
    console.error("Error creating topping: ", error);
    throw error;
  }
}

async function updateTopping(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
            UPDATE topping_options
            SET ${setString}
            WHERE topping_id=$${dataArray.length + 1}
            RETURNING *;
            `;
  dataArray.push(id);
  console.log("DATA_ARRAY: ", dataArray);

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [topping],
    } = await client.query(sql, dataArray);
    console.log("db topping: ", topping);
    return topping;
  } catch (error) {
    console.error("Error updating topping: ", error);
    throw error;
  }
}

async function getAllToppings() {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM topping_options
            
            `
    );
    return rows;
  } catch (error) {
    console.error("Error getting all toppings: ", error);
    throw error;
  }
}

async function getToppingById(id) {
  try {
    const {
      rows: [topping],
    } = await client.query(
      `
            SELECT * 
            FROM topping_options
            WHERE topping_id = $1
            
            `,
      [id]
    );

    return topping;
  } catch (error) {
    console.error("Error getting topping by ID: ", error);
    throw error;
  }
}

async function getToppingByTitle(title) {
  try {
    const {
      rows: [topping],
    } = await client.query(
      `
            SELECT *
            FROM topping_options
            WHERE title = $1
            `,
      [title]
    );
    return topping;
  } catch (error) {
    console.error("Error getting ingredient by title: ", error);
    throw error;
  }
}

async function getToppingsByOrderedPizza(ordered_pizza_id) {
  try {
    const { rows } = await client.query(
      `
            SELECT topping_options.*
            FROM topping_options
            JOIN pizza_toppings ON pizza_toppings.topping_id = topping_options.topping_id
            JOIN ordered_pizza ON ordered_pizza.ordered_pizza_id = pizza_toppings.pizza_id
            WHERE ordered_pizza.ordered_pizza_id = $1
            `,
      [ordered_pizza_id]
    );

    return rows;
  } catch (error) {
    console.error("Error getting topping by ordered pizza: ", error);
    throw error;
  }
}

async function attachToppingToOrderedPizza({ topping_id, pizza_id }) {
  try {
    await client.query(
      `
      INSERT INTO pizza_toppings (topping_id, pizza_id)
      VALUES ($1, $2);
      `,
      [topping_id, pizza_id]
    );

    return "Topping attached to ordered pizza successfully";
  } catch (error) {
    console.error("Error attaching topping to ordered pizza", error);
    throw error;
  }
}


async function removeIngredientFromPizza(id) {
  try {
    const { rows } = await client.query(
      `
            DELETE FROM pizza_order
            WHERE id=$1
            RETURNING *;
            
            `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error removing ingredient from pizza: ", error);
    throw error;
  }
}

async function deleteIngredient(id) {
  try {
    await client.query(
      `
            DELETE FROM ingredient_category
            WHERE ingredient_id = $1
            `,
      [id]
    );

    await client.query(
      `
            DELETE FROM pizza_order
            WHERE ingredient_id = $1
            `,
      [id]
    );

    const {
      rows: [ingredient],
    } = await client.query(
      `
            DELETE FROM ingredients
            WHERE id = $1
            
            `,
      [id]
    );

    return ingredient;
  } catch (error) {
    console.error("Error deleting ingredient: ", error);
    throw error;
  }
}

module.exports = {
  createIngredient,
  updateIngredient,
  getAllIngredients,
  getIngredientById,
  getIngredientByTitle,
  getIngredientsByCategory,
  attachIngredientToPizza,
  removeIngredientFromPizza,
  attachIngredientToCategory,
  removeIngredientFromCategory,
  deleteIngredient,
};