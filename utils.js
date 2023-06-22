const jsonl = require("node-jsonl");
const fs = require("fs").promises;
const { Pool } = require("pg");

require("dotenv").config();

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD } = process.env;

function getPool() {
  return new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: 5432, // or your PostgreSQL port number
  });
}

// Create 'users_revenue' table
async function createTable(poolClient) {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS users_revenue (
          user_id VARCHAR(255) NOT NULL,
          revenue INT,
          CONSTRAINT unique_user_id UNIQUE (user_id)
        )
      `;
    await poolClient.query(query);
    console.log("Table created successfully");
    poolClient.release();
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

// Insert user event into 'users_revenue' table
async function updateUserRevenue(poolClient, userId, revenue) {
  try {
    const query = `
    INSERT INTO users_revenue (user_id, revenue)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET revenue = $2
  `;

    const values = [userId, revenue];

    await poolClient.query(query, values);

    console.log(`Revenue updated for user ${userId}`);
  } catch (err) {
    console.error("Error updating revenue:", err);
  }
}

// Get a user revenue from 'users_revenue' table
async function getUserRevenue(poolClient, userId) {
  try {
    const query = `
        SELECT user_id, revenue FROM users_revenue
        WHERE user_id = $1
      `;

    console.log(`Revenue query for user ${userId}`);
    const values = [userId];
    const res = await poolClient.query(query, values);

    return res?.rows[0];
  } catch (err) {
    console.error("Error getting revenue:", err);
  }
}

// Get an object, filepath and write it to file
async function writeObjectToJsonlFile(object, filePath) {
  try {
    const jsonString = JSON.stringify(object);
    const jsonlString = `${jsonString}\n`;

    await fs.appendFile(filePath, jsonlString);
    console.log("Object written to JSONL file successfully.");
  } catch (err) {
    console.error("Error writing to JSONL file:", err);
  }
}

// // Calculate user's revenue
// function calculateRevenue(eventData, usersRevenueMap) {
//   const { userId, name, value } = eventData;

//   if (!usersRevenueMap.has(userId)) {
//     usersRevenueMap.set(userId, 0);
//   }

//   if (name === "add_revenue") {
//     usersRevenueMap.set(userId, usersRevenueMap.get(userId) + value);
//   } else if (name === "subtract_revenue") {
//     usersRevenueMap.set(userId, usersRevenueMap.get(userId) - value);
//   }
// }

async function readEventsFromJson(file) {
  try {
    const rl = jsonl.readlines(file);

    const events = [];

    while (true) {
      const { value, done } = await rl.next();
      if (done) break;
      events.push(value); // value => T
    }

    return events;
  } catch (error) {
    console.log("Error reading events from JSONL file:", error);
  }
}

module.exports = {
  getPool,
  createTable,
  readEventsFromJson,
  updateUserRevenue,
  getUserRevenue,
  writeObjectToJsonlFile,
};
