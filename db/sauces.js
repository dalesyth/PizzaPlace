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






module.exports = {
    createSauce,

}