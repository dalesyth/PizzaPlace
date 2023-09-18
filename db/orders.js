const { client } = require("./index");

async function createOrder({ ...fields }) {
  const dataArray = Object.values(fields);
  //Build fields list
  let columnNames = Object.keys(fields)
    .map((key) => `"${key}"`)
    .join(", ");
  //Build VALUES place holder.
  let valuePlaceHolders = Object.keys(fields)
    .map((keys, index) => {
      return `$${index + 1}`;
    })
    .join(", ");

  const newOrderSQL = `
        INSERT INTO orders
        (${columnNames})
        VALUES(${valuePlaceHolders})
        RETURNING *;
        `;

  const {
    rows: [order],
  } = await client.query(newOrderSQL, dataArray);
  return order;
}

async function getAllOpenOrders() {
  try {
    const {
      rows: [orders],
    } = await client.query(`
        SELECT *
        FROM orders
        WHERE orders.order_complete = FALSE
        
        
        `);

    return orders;
  } catch (error) {
    console.error("Error getting all open orders: ", error);
    throw error;
  }
}

async function getOrderByOrderId(orderId) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
        SELECT *
        FROM orders
        WHERE order_id=$1
        
        `,
      [orderId]
    );

    return order;
  } catch (error) {
    console.error("Error getting order by orderId: ", error);
    throw error;
  }
}

async function getOrderByUserId(userId) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    SELECT *
    FROM orders
    WHERE user_id=$1
    
    `,
      [userId]
    );

    return order;
  } catch (error) {
    console.error("Error getting order by user ID: ", error);
    throw error;
  }
}

async function deleteOrder(orderId) {
  try {
    await client.query(
      `
        DELETE FROM ordered_pizza
        WHERE order_id=$1
        
        `,
      [orderId]
    );

    await client.query(
      `
            DELETE FROM orders
            WHERE order_id=$1
            `,
      [orderId]
    );
  } catch (error) {
    console.error("Error deleting order: ", error);
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrderByOrderId,
  getAllOpenOrders,
  getOrderByUserId,
  deleteOrder,
};
