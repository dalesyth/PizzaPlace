const { client } = require("./index");

async function createSide({ title, price }) {
  try {
    const {
      rows: [side],
    } = await client.query(
      `
            INSERT INTO side_options (title, price)
            VALUES ($1, $2)
            RETURNING *;
        `,
      [title, price]
    );

    return side;
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
      rows: [side],
    } = await client.query(
      `
            SELECT *
            FROM side_options
            WHERE side_option_id = $1
        `,
      [id]
    );
    return side;
  } catch (error) {
    console.error("Error getting side by id: ", error);
    throw error;
  }
}

async function getSideByTitle(title) {
  try {
    const {
      rows: [side],
    } = await client.query(
      `
            SELECT *
            FROM side_options
            WHERE title = $1
        
        `,
      [title]
    );
    return side;
  } catch (error) {
    console.error("Error getting side by title: ", error);
    throw error;
  }
}

async function attachSideToOrder({ sideId, orderId }) {
  try {
    const {
      rows: [side],
    } = await client.query(
      `
            INSERT INTO ordered_sides (side_id, order_id)
            VALUES ($1, $2)
            RETURNING *
        `,
      [sideId, orderId]
    );

    return side;
  } catch (error) {
    console.error("Error adding side to order; ", error);
    throw error;
  }
}

async function removeSideFromOrder({ sideId, orderId }) {
  try {
    const {
      rows: [side],
    } = await client.query(
      `
            DELETE FROM ordered_sides
            WHERE side_id = $1 AND order_id = $2
            RETURNING *
        
        `,
      [sideId, orderId]
    );

    return side;
  } catch (error) {
    console.error("Error removing side from order: ", error);
    throw error;
  }
}

async function getSidesByOrder(orderId) {
  try {
    const { rows } = await client.query(
      `
            SELECT side_options.title AS side_option_title
            FROM side_options
            JOIN ordered_sides ON ordered_sides.side_id = side_options.side_option_id
            JOIN orders ON orders.order_id = ordered_sides.order_id
            WHERE orders.order_id = $1

        `,
      [orderId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting sides by order: ", error);
    throw error;
  }
}

async function deleteSide(id) {
  try {
    await client.query(
      `
            DELETE FROM ordered_sides
            WHERE side_id = $1
        `,
      [id]
    );

    const {
      rows: [side],
    } = await client.query(
      `
            DELETE FROM side_options
            WHERE side_option_id = $1
        `,
      [id]
    );

    return side;
  } catch (error) {
    console.error("Error deleting side: ", error);
    throw error;
  }
}

module.exports = {
  createSide,
  updateSide,
  getAllSides,
  getSideById,
  getSideByTitle,
  getSidesByOrder,
  attachSideToOrder,
  removeSideFromOrder,
  deleteSide,
};
