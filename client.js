const { readEventsFromJson } = require("./utils");
const axios = require("axios");

require("dotenv").config();

const { PORT, SECRET_HEADER } = process.env;

(async function () {
  const events = await readEventsFromJson("./events.jsonl");

  for (const event of events) {
    const { userId, name, value } = event;
    try {
      const { data } = await axios.post(
        `http://localhost:${PORT}/liveEvent`,
        {
          userId,
          name,
          value,
        },
        { headers: { Authorization: SECRET_HEADER } }
      );
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  }
  console.log("Done reading events from json and sending to server");
})();
