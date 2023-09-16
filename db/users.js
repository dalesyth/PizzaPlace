const { client } = require("./index");
const bcrypt = require('bcrypt')

async function createUser({ first_name, last_name, password, email, is_admin = false }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (first_name, last_name, password, email, is_admin)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
            RETURNING *;
        
        `,
      [first_name, last_name, hashedPassword, email, is_admin]
    );

    return user;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

async function createAdmin({
  first_name,
  last_name,
  password,
  email,
  is_admin = true,
}) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (first_name, last_name, password, email, is_admin)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING
            RETURNING *;
        
        `,
      [first_name, last_name, hashedPassword, email, is_admin]
    );

    return user;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
            SELECT user_id, username, email
            FROM users;
        `);

    return users;
  } catch (error) {
    console.error("Error getting all users: ", error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT *
            FROM users
            WHERE username = $1; 
            
            `,
      [username]
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error("Error getting user by username: ", error);
    throw error;
  }
}

async function getUserByUserId(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT *
            FROM users
            WHERE id = $1;
            
            `,
      [userId]
    );
    delete user.password;
    return user;
  } catch (error) {
    console.error("Error getting user by userId: ", error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    await client.query(
      `
            DELETE FROM pizza_order
            WHERE order_id IN (
                SELECT id
                FROM orders
                WHERE user_id=$1
            )  
            `,
      [userId]
    );

    await client.query(
      `
            DELETE FROM orders
            WHERE user_id=$1   
            `,
      [userId]
    );

    const {
      rows: [user],
    } = await client.query(
      `
            DELETE FROM users
            WHERE id=$1
            RETURNING *;
            `,
      [userId]
    );

    return user;
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
}


module.exports = {
  createUser,
  createAdmin,
  getAllUsers,
  getUserByUsername,
  getUserByUserId,
  deleteUser,
};
