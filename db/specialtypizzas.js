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
    console.error("Error creating ordered pizza: ", error);
    throw error;
  }
}