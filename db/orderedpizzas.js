const { client } = require("./index")

async function createOrderedPizza({ ...fields }) {
    const dataArray = Object.values(fields);
    let columnNames = Object.keys(fields).map((key) => `"${key}`).join(", ");
    let valuePlaceHolders = Object.keys(fields).map((keys, index) => {
        return `$${index + 1}`;
    }).join(", ");

    const newOrderSQL = `
    INSERT INTO ordered_pizza
    (${columnNames})
    VALUES(${valuePlaceHolders})
    RETURNING *;
    `;

    try {
        const {
            rows: [orderedPizza],
        } = await client.query(newOrderSQL, dataArray);
        return orderedPizza
    } catch (error) {
        console.error("Error creating ordered pizza: ", error)
        throw error;
    }
}

async function updateOrderedPizza(id, ...fields) {
    let dataArray = Object.values(fields[0]);
    const setString = Object.keys(fields[0]).map((key, index) => `"${key}"=$${index + 1}`).join(",");
    const sql = `
        UPDATE ordered_pizza
        SET ${setString}
        WHERE ordered_pizza_id=$${dataArray.length + 1}
        RETURNING *;
    `;
    dataArray.push(id);

    if (setString.length === 0) {
        return;
    }

    try {
        const {
            rows: [orderedPizza],
        } = await client.query(sql, dataArray);
        return orderedPizza
    } catch (error) {
        console.error("Error updating ordered pizza: ", error)
        throw error;
    }
}

async function getOrderedPizzaByPizzaId(ordered_pizza_id) {
    try {
        const {
            rows: [orderedPizza],
        } = await client.query(
            `
                SELECT *
                FROM ordered_pizza
                WHERE ordered_pizza_id = $1
            `,[ordered_pizza_id]
        )
        return orderedPizza
    } catch (error) {
        console.error("Error getting ordered pizza by pizza id: ", error);
        throw error;
    }
}

async function getOrderedPizzasByUser(user_id) {
    try {
        const {
            rows
        } = await client.query(
            `
                SELECT ordered_pizza.*
                FROM ordered_pizza
                JOIN orders ON orders.order_id = ordered_pizza.order_id
                JOIN users ON users.user_id = orders.user_id
                WHERE users.user_id = $1
            `, [user_id]
        )

        return rows;
    } catch (error) {
        console.error("Error get ordered pizza by user: ", error)
        throw error;
    }
}

async function getOrderedPizzasByOrderId(order_id) {
    try {
        const { rows } = await client.query(
            `
                SELECT *
                FROM ordered_pizza
                WHERE order_id = $1
            
            `, [order_id]
        )

        return rows
    } catch (error) {
        console.error("Error getting ordered pizza by order id: ", error)
        throw error;
    }
}






module.exports = {
    getOrderedPizzaByPizzaId,
    getOrderedPizzasByUser,
    getOrderedPizzasByOrderId,
    createOrderedPizza,
    updateOrderedPizza,
}