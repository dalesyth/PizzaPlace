import { client } from "./index";
import * as bcrypt from "bcrypt";

async function createUser({ username, password, email, isAdmin = false }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (username, password, email, is_admin)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        
        `,
      [username, hashedPassword, email, isAdmin]
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
            SELECT id, username, email
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

export {
  createUser,
  getAllUsers,
  getUserByUsername,
  getUserByUserId,
  deleteUser,
};
