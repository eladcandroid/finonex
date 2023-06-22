const { readEventsFromJson } = require("./utils");
const axios = require("axios");

require("dotenv").config();

const { PORT, SECRET_HEADER } = process.env;

(async function () {
  const events = await readEventsFromJson("./events.jsonl");

  console.log(events);

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
  //   events.forEach((event) => {

  // if (event.trim() !== "") {
  //   const eventData = JSON.parse(event);
  // calculateRevenue(eventData, usersRevenueMap);
  //   });
  // }
  //   });
})();

// events.forEach((event) => {
//   if (event.trim() !== "") {
//     const eventData = JSON.parse(event);
//     calculateRevenue(eventData, usersRevenueMap);
//   }
// });
