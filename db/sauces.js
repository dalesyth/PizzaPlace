const { client } = require("./index");

async function createSauce({ title, image_name }) {
    try {
        const {
            rows: [sauce],
        } = await client.query(`

            INSERT INTO sauce_options (title, image_name)
            VALUES ($1, $2)
            RETURNING *;
        
        
        `, [title, image_name])

        return sauce;
    } catch (error) {
        console.error("Error creating sauce: ", error)
        throw error;
    }
}

async function updateSauce(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
            UPDATE sauce_options
            SET ${setString}
            WHERE sauce_id=$${dataArray.length + 1}
            RETURNING *;
            `;
  dataArray.push(id);
  console.log("DATA_ARRAY: ", dataArray);

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [sauce],
    } = await client.query(sql, dataArray);
    console.log("db sauce: ", sauce);
    return sauce;
  } catch (error) {
    console.error("Error updating sauce: ", error);
    throw error;
  }
}

async function getAllSauces() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM sauce_options
        
        `)
        return rows;
    } catch (error) {
        console.error("Error getting all sauces: ", error)
        throw error;
    }
}

async function getSauceById(id) {
    try {
        const {
            rows: [sauce],
        } = await client.query(`
            SELECT * 
            FROM sauce_options
            WHERE sauce_id = $1
        `, [id])
        return sauce
    } catch (error) {
        console.error("Error getting sauce by id: ", error)
        throw error;
    }
}

async function getSauceByTitle(title) {
    try {
        const {
            rows: [sauce],
        } = await client.query(`
            SELECT *
            FROM sauce_options
            WHERE title = $1
        
        `, [title])
        return sauce;
    } catch (error) {
        console.error("Error getting sauce by title: ", error)
        throw error;
    }
}

async function addSauceToOrderedPizza({ sauceId, pizzaId }) {
    try {
        await client.query(`
            UPDATE ordered_pizza
            SET sauce = $1
            WHERE ordered_pizza_id = $2
        `, [sauceId, pizzaId])
        return "Sauce attached to ordered pizza successfully"
    } catch (error) {
        console.error("Error adding sauce to ordered pizza: ", error)
        throw error;
    }
}

async function removeSauceFromOrderedPizza({ sauceId, pizzaId }) {
    try {
        const { rows } = await client.query(
            `
                DELETE FROM ordered_pizza
                WHERE sauce = $1 AND ordered_pizza_id = $2
                RETURNING *;
            
            `,
            [sauceId, pizzaId]
        )

        if (rows.length === 0) {
            return null;
        }

        return "Sauce removed from pizza";
    } catch (error) {
        console.error("Error removing sauce from ordered pizza: ", error)
        throw error;
    }
}

async function deleteSauce(id) {
    try {
        await client.query(`
            DELETE FROM ordered_pizza
            WHERE sauce = $1
        
        `, [id])

        await client.query(`
            DELETE FROM sauce_options
            WHERE sauce_id = $1
        `, [id])

        return "Sauce option successfully removed from db"
    } catch (error) {
        console.error("Error deleting sauce option: ", error)
        throw error;
    }
}


module.exports = {
    createSauce,
    updateSauce,
    getAllSauces,
    getSauceById,
    getSauceByTitle,
    addSauceToOrderedPizza,
    removeSauceFromOrderedPizza,
    deleteSauce,
}