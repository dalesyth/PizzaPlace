import { client } from "./index";

async function createOrder({ userId, orderTotal }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
        INSERT INTO orders (user_id, order_total)
        VALUES ($1, $2)
        RETURNING *;
        `,
      [userId, orderTotal]
    );

    return order;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
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
        WHERE id=$1
        
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
    } = await client.query(`
    SELECT *
    FROM orders
    WHERE user_id=$1
    
    `, [userId]);

    return order;
  } catch (error) {
    console.error("Error getting order by user ID: ", error);
    throw error;
  }
}

async function deleteOrder(orderId) {
    try {
        
        await client.query(`
        DELETE FROM pizza_order
        WHERE order_id=$1
        
        `, [orderId]);

        await client.query(
            `
            DELETE FROM orders
            WHERE id=$1
            `,
            [orderId]
        )
    } catch (error) {
        console.error("Error deleting order: ", error);
        throw error;
    }
}

export { createOrder, getOrderByOrderId, getAllOpenOrders, getOrderByUserId, deleteOrder };
