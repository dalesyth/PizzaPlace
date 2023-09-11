import { client } from "./index";

async function createCategory(title) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
            INSERT INTO categories (title)
            VALUES ($1)
            RETURNING *;
            
            `,
      [title]
    );
    return category;
  } catch (error) {
    console.error("Error creating category: ", error);
    throw error;
  }
}

async function updateCategory(id, title) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
            UPDATE categories
            SET title = $2
            WHERE id = $1
            RETURNING *;
            
            `,
      [id, title]
    );
    return category;
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
}

async function getAllCategories() {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM categories
            `
    );
    return rows;
  } catch (error) {
    console.error("Error getting all categories: ", error);
    throw error;
  }
}

async function getCategoryById(id) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
            SELECT *
            FROM categories
            WHERE id=$1
            
            `,
      [id]
    );
    return category;
  } catch (error) {
    console.error("Error getting category by ID: ", error);
    throw error;
  }
}

async function getCategoryByTitle(title) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
            SELECT *
            FROM categories
            WHERE title = $1
            
            `,
      [title]
    );
    return category;
  } catch (error) {
    console.error("Error getting category by title: ", error);
    throw error;
  }
}

async function getCategoryByIngredient(ingredientId) {
  try {
    const { rows } = await client.query(
      `
            SELECT categories.*
            FROM categories
            JOIN ingredient_category ON categories.id = ingredient_category.category_id
            WHERE ingredient_category.ingredient_id=$1
            
            `,
      [ingredientId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting category by ingredient: ", error);
    throw error;
  }
}

async function deleteCategory(id) {
  try {
    await client.query(
      `
            DELETE FROM ingredient_category
            WHERE category_id = $1
            
            `,
      [id]
    );

    const { rows } = await client.query(
      `
            DELETE FROM categories
            WHERE id = $1
            
            `
    );

    return rows;
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error;
  }
}

export {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByTitle,
  getCategoryByIngredient,
  deleteCategory,
};
