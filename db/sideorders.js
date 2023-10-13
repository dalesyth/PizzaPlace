const { client } = require("./index");

async function createSide({ title, price }) {
    try {
        const {
            rows: [side],
        } = await client.query(`
            INSERT INTO side_options (title, price)
            VALUES ($1, $2)
            RETURNING *;
        `, [title, price]);

        return side
    } catch (error) {
        console.error("Error creating side: ", error);
        throw error;
    }
}

async function updateSide(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
            UPDATE side_options
            SET ${setString}
            WHERE side_option_id=$${dataArray.length + 1}
            RETURNING *;
            `;
  dataArray.push(id);
  console.log("DATA_ARRAY: ", dataArray);

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [side],
    } = await client.query(sql, dataArray);
    console.log("db side: ", side);
    return side;
  } catch (error) {
    console.error("Error updating side options: ", error);
    throw error;
  }
}

async function getAllSides() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM side_options
        `);
        return rows;
    } catch (error) {
        console.error("Error getting sides: ", error);
        throw error;
    }
}

async function getSideById(id) {
    try {
        const {
            rows: [side]
        } = await client.query(`
            SELECT *
            FROM side_options
            WHERE side_option_id = $1
        `, [id]);
        return side;
    } catch (error) {
        console.error("Error getting side by id: ", error);
        throw error;
    }
}

async function getSideByTitle(title) {
    try {
        const {
            rows: [side]
        } = await client.query(`
            SELECT *
            FROM side_options
            WHERE title = $1
        
        `, [title]);
        return side;
    } catch (error) {
        console.error("Error getting side by title: ", error);
        throw error;
    }
}

async function addSideToOrder({ sideId, orderId }) {
    try {
        
    } catch (error) {
        console.error("Error adding side to order; ", error);
        throw error
    }
}
