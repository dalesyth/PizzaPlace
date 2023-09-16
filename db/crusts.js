const { client } = require("./index");

async function createCrust({ title, image_name }) {
  try {
    const {
      rows: [crust],
    } = await client.query(
      `
            INSERT INTO crust_options (title, image_name)
            VALUES ($1, $2)
            RETURNING *
        
        `,
      [title, image_name]
    );
    return crust;
  } catch (error) {
    console.error("Error creating crust option: ", error);
    throw error;
  }
}

async function updateCrust(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
            UPDATE crust_options
            SET ${setString}
            WHERE crust_id=$${dataArray.length + 1}
            RETURNING *;
            `;
  dataArray.push(id);
  console.log("DATA_ARRAY: ", dataArray);

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [crust],
    } = await client.query(sql, dataArray);
    console.log("db crust: ", crust);
    return crust;
  } catch (error) {
    console.error("Error updating crust: ", error);
    throw error;
  }
}

async function getAllCrusts() {
  try {
    const { rows } = await client.query(`
            SELECT *
            FROM crust_options

        `);
    return rows;
  } catch (error) {
    console.error("Error getting all crust options: ", error);
    throw error;
  }
}

async function getCrustById(id) {
  try {
    const {
      rows: [crust],
    } = await client.query(
      `
            SELECT *
            FROM crust_options
            WHERE crust_id = $1
        
        `,
      [id]
    );
    return crust;
  } catch (error) {
    console.error("Error getting crust by id: ", error);
    throw error;
  }
}

async function getCrustByTitle(title) {
  try {
    const {
      rows: [crust],
    } = await client.query(
      `
            SELECT *
            FROM crust_options
            WHERE title = $1
        
        
        `,
      [title]
    );
    return crust;
  } catch (error) {
    console.error("Error getting crust by title: ", error);
    throw error;
  }
}

async function addCrustToOrderedPizza({ crustId, pizzaId }) {
  try {
    await client.query(
      `
            UPDATE ordered_pizza
            SET crust = $1
            WHERE ordered_pizza_id = $2
        
        `,
      [crustId, pizzaId]
    );
    return "Crust attached to ordered pizza successfully";
  } catch (error) {
    console.error("Error adding crust to ordered pizza: ", error);
    throw error;
  }
}

async function deleteCrust(id) {
  try {
    await client.query(
      `
            DELETE FROM ordered_pizza
            WHERE crust = $1
        
        `,
      [id]
    );

    await client.query(
      `
            DELETE FROM crust_options
            WHERE crust_id = $1
        
        `,
      [id]
    );
    return "Crust option successfully removed from db";
  } catch (error) {
    console.error("Error deleting crust option: ", error);
    throw error;
  }
}

module.exports = {
  createCrust,
  updateCrust,
  getAllCrusts,
  getCrustById,
  getCrustByTitle,
  addCrustToOrderedPizza,
  deleteCrust,
};
