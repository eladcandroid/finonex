const express = require("express");
const app = express();

const {
  createTable,
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

app.post("/liveEvent", async (req, res) => {
  const authHeader = req.headers.authorization;

  const { userId, name, value } = req.body;

  if (authHeader && authHeader === SECRET_HEADER) {
    // Authorized, read the body and write to a file
    if (userId && name && value) {
      const filename = "./serverEvents.jsonl";
      await writeObjectToJsonlFile({ userId, name, value }, filename);
    }

    res.send("Done!");
  } else {
    // Unauthorized, send error response
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/userEvents/:userId", async (req, res) => {
  const { userId } = req.params;

  poolClient = await pool.connect();

  if (userId) {
    const revenue = await getUserRevenue(poolClient, userId);

    return res.send(revenue);
  }

  return res.send("No user events found");
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
