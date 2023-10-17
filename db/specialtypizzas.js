const { client } = require("./index");

async function createSpecialtyPizza({ ...fields }) {
  const dataArray = Object.values(fields);
  let columnNames = Object.keys(fields)
    .map((key) => `"${key}`)
    .join(", ");
  let valuePlaceHolders = Object.keys(fields)
    .map((keys, index) => {
      return `$${index + 1}`;
    })
    .join(", ");

  const newOrderSQL = `
    INSERT INTO specialty_pizzas
    (${columnNames})
    VALUES(${valuePlaceHolders})
    RETURNING *;
    `;

  try {
    const {
      rows: [specialtyPizza],
    } = await client.query(newOrderSQL, dataArray);
    return specialtyPizza;
  } catch (error) {
    console.error("Error creating specialty pizza: ", error);
    throw error;
  }
}

async function updateSpecialtyPizza(id, ...fields) {
  let dataArray = Object.values(fields[0]);
  const setString = Object.keys(fields[0])
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  const sql = `
        UPDATE specialty_pizzas
        SET ${setString}
        WHERE pizza_id=$${dataArray.length + 1}
        RETURNING *;
    `;
  dataArray.push(id);

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [specialtyPizza],
    } = await client.query(sql, dataArray);
    return specialtyPizza;
  } catch (error) {
    console.error("Error updating specialty pizza: ", error);
    throw error;
  }
}