const { client } = require("./index");

async function createOrder({ ...fields }) {
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

async function updateOrder(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
          UPDATE orders
          SET ${setString}
          WHERE order_id=$${dataArray.length + 1}
          RETURNING *;
          `;
  dataArray.push(id);

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [order],
    } = await client.query(sql, dataArray);
    return order;
  } catch (error) {
    console.error("Error updating order: ", error);
    throw error;
  }
}

async function getAllOrders() {
  try {
    const { rows } = await client.query(`
    
        SELECT *
        FROM orders
    
    `);
    return rows;
  } catch (error) {
    console.error("Error getting all orders: ", error);
    throw error;
  }
}

async function getAllOpenOrders() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM orders
        WHERE orders.order_complete = FALSE
        
        
        `);

    return rows;
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
    const { rows } = await client.query(
      `
    SELECT *
    FROM orders
    WHERE user_id=$1
    
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting order by user ID: ", error);
    throw error;
  }
}

async function attachPizzaToOrder({
  order_id,
  pizza_price,
  quantity,
  size,
  crust,
  sauce,
  is_specialty,
  specialty_pizza_id,
}) {
  try {
    const {
      rows: [pizza],
    } = await client.query(
      `
      INSERT INTO ordered_pizza (order_id, pizza_price, quantity, size, crust, sauce, is_specialty, specialty_pizza_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `,
      [
        order_id,
        pizza_price,
        quantity,
        size,
        crust,
        sauce,
        is_specialty,
        specialty_pizza_id,
      ]
    );

    return pizza;
  } catch (error) {
    console.error("Error attaching pizza to order: ", error);
    throw error;
  }
}

async function deleteOrder(orderId) {
  try {
    await client.query(
      `
      DELETE FROM pizza_toppings
      WHERE pizza_id IN 
      (SELECT ordered_pizza_id FROM ordered_pizza WHERE order_id =$1)
      
      `,
      [orderId]
    );

    await client.query(
      `
        DELETE FROM ordered_pizza
        WHERE order_id=$1
        
        `,
      [orderId]
    );

    await client.query(
      `
        DELETE FROM ordered_sides
        WHERE order_id=$1
      `,
      [orderId]
    );

    const {
      rows: [deletedOrder],
    } = await client.query(
      `
            DELETE FROM orders
            WHERE order_id=$1
            RETURNING *
            `,
      [orderId]
    );

    return deletedOrder;
  } catch (error) {
    console.error("Error deleting order: ", error);
    throw error;
  }
}

module.exports = {
  createOrder,
  updateOrder,
  getOrderByOrderId,
  getAllOrders,
  getAllOpenOrders,
  getOrderByUserId,
  attachPizzaToOrder,
  deleteOrder,
};
