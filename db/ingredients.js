const { client } = require("./index")

async function createIngredient({ title, image_name }) {
  try {
    const {
      rows: [ingredient],
    } = await client.query(
      `
            INSERT INTO ingredients (title, image_name)
            VALUES ($1, $2)
            RETURNING *;
            `,
      [title, image_name]
    );

    return ingredient;
  } catch (error) {
    console.error("Error creating ingredient: ", error);
    throw error;
  }
}

async function updateIngredient(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
            UPDATE ingredients
            SET ${setString}
            WHERE id=$${dataArray.length + 1}
            RETURNING *;
            `;
  dataArray.push(id);
  console.log("DATA_ARRAY: ", dataArray);

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [ingredient],
    } = await client.query(sql, dataArray);
    console.log("db ingredient: ", ingredient);
    return ingredient;
  } catch (error) {
    console.error("Error updating ingredient: ", error);
    throw error;
  }
}

async function getAllIngredients() {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM ingredients
            
            `
    );
    return rows;
  } catch (error) {
    console.error("Error getting all ingredients: ", error);
    throw error;
  }
}

async function getIngredientById(id) {
  try {
    const {
      rows: [ingredient],
    } = await client.query(
      `
            SELECT * 
            FROM ingredients
            WHERE id = $1
            
            `,
      [id]
    );

    return ingredient;
  } catch (error) {
    console.error("Error getting ingredient by ID: ", error);
    throw error;
  }
}

async function getIngredientByTitle(title) {
  try {
    const {
      rows: [ingredient],
    } = await client.query(
      `
            SELECT *
            FROM ingredients
            WHERE title = $1
            `,
      [title]
    );
    return ingredient;
  } catch (error) {
    console.error("Error getting ingredient by title: ", error);
    throw error;
  }
}

async function getIngredientsByCategory(categoryId) {
  try {
    const { rows } = await client.query(
      `
            SELECT ingredients.*
            FROM ingredients
            JOIN ingredient_category ON ingredient_category.ingredient_id = ingredients.id
            WHERE ingredient_category.category_id = $1
            `,
      [categoryId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting ingredient by category: ", error);
    throw error;
  }
}

async function attachIngredientToPizza({
  ingredientId,
  orderId,
  pizzaPrice,
  quantity,
  size,
}) {
  try {
    const { rows } = await client.query(
      `
            INSERT INTO pizza_order
            (ingredient_id, order_id, pizza_price, quantity, size)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            
            `,
      [ingredientId, orderId, pizzaPrice, quantity, size]
    );
    return rows;
  } catch (error) {
    console.error("Error attaching ingredient to pizza: ", error);
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

async function attachIngredientToCategory(ingredientId, categoryId) {
  try {
    const { rows } = await client.query(
      `
            INSERT INTO ingredient_category
            (ingredient_id, category_id)
            VALUES ($1, $2)
            RETURNING *
            `,
      [ingredientId, categoryId]
    );
    return rows;
  } catch (error) {
    console.error("Error attaching ingredient to category: ", error);
    throw error;
  }
}

async function removeIngredientFromCategory(ingredientId, categoryId) {
  try {
    const { rows } = await client.query(
      `
            DELETE FROM ingredient_category
            WHERE ingredient_id = $1 AND category_id = $2
            
            `,
      [ingredientId, categoryId]
    );

    return rows;
  } catch (error) {
    console.error("Error removing ingredient from category: ", error);
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
