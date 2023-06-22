const {
  readEventsFromJson,
  updateUserRevenue,
  getPool,
  createTable,
} = require("./utils");

const usersRevenueMap = new Map();

// Calculate user's revenue
function calculateRevenue(eventData) {
  const { userId, name, value } = eventData;

  if (!usersRevenueMap.has(userId)) {
    usersRevenueMap.set(userId, 0);
  }

  if (name === "add_revenue") {
    usersRevenueMap.set(userId, usersRevenueMap.get(userId) + value);
  } else if (name === "subtract_revenue") {
    usersRevenueMap.set(userId, usersRevenueMap.get(userId) - value);
  }
}

(async function () {
  try {
    const fileName = process.argv[2];

    // Check if the file name is provided
    if (!fileName) {
      console.error("Please provide a file name as a command-line parameter.");
      process.exit(1);
    }

    const pool = getPool();
    const poolClient = await pool.connect();

    await createTable(poolClient);

    const events = await readEventsFromJson(fileName);

    for (const event of events) {
      calculateRevenue(event);
    }

    for (const [userId, value] of usersRevenueMap) {
      if (userId && value) {
        await updateUserRevenue(poolClient, userId, value);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
})();
