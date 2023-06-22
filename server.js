const express = require("express");
const app = express();

const {
  createTable,
  readEventsFromJson,
  updateUserRevenue,
  getUserRevenue,
  getPool,
  writeObjectToJsonlFile,
} = require("./utils");

require("dotenv").config();

const { PORT, SECRET_HEADER } = process.env;

app.use(express.json());

// PostgreSQL connection configuration
const pool = getPool();

let poolClient = null;

// const rl = jsonl.readlines("./events.jsonl");

// while (true) {
//   const { value, done } = await rl.next();
//   if (done) break;
//   console.log(value); // value => T
// }

// // Read events from 'events.jsonl' file
// fs.readFile("events.jsonl", "utf8", (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }

//   const events = data.split("\n");
//   const usersRevenueMap = new Map();

//   events.forEach((event) => {
//     if (event.trim() !== "") {
//       const eventData = JSON.parse(event);
//       calculateRevenue(eventData, usersRevenueMap);
//     }
//   });

//   saveRevenueToDatabase(usersRevenueMap);
// });

// // Save revenue to the database
// async function saveRevenueToDatabase(usersRevenueMap) {
//   try {
//     const client = await pool.connect();

//     for (const [userId, revenue] of usersRevenueMap) {
//       const query = `
//           INSERT INTO users_revenue (user_id, revenue)
//           VALUES ($1, $2)
//           ON CONFLICT (user_id)
//           DO UPDATE SET revenue = $2
//         `;

//       const values = [userId, revenue];
//       await client.query(query, values);
//       console.log(`Revenue updated for user ${userId}`);
//     }

//     client.release();
//   } catch (err) {
//     console.error("Error saving revenue to the database:", err);
//   }
// }

app.post("/liveEvent", async (req, res) => {
  const authHeader = req.headers.authorization;

  const { userId, name, value } = req.body;

  if (authHeader && authHeader === SECRET_HEADER) {
    // Authorized, read the body and write to a file

    if (userId && name && value) {
      await writeObjectToJsonlFile(
        { userId, name, value },
        "./serverEvents.jsonl"
      );
    }

    res.send("Done!");
  } else {
    // Unauthorized, send error response
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/userEvents/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("userId", userId);
  if (userId) {
    const revenue = await getUserRevenue(poolClient, userId);

    res.send(revenue);
  }
});

app.get("/", async (req, res) => {
  res.send("Server healthy");
});

// Start the server
app.listen(PORT, async () => {
  console.log("Server is running on port 3000");

  try {
    poolClient = await pool.connect();
    await createTable(poolClient);
  } catch (error) {
    console.log("Connection to pool failed", error);
  }
});
