const http = require("http");

require("dotenv").config();

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");
const { mongoConnect } = require("./services/mongo");

const MONGO_URL =
  "mongodb+srv://NASA-api:k1K8mX2QswT3M9fH@nasacluster.kfaicwo.mongodb.net/nasa";
const PORT = process.env.PORT || 8000;

// Making a server with http and putting app as a middleware
// so we can write all express code in only one file (app.js)
const server = http.createServer(app);

// mongoose.connection.once("open", () => {
//   console.log("Connected to DB");
// });
// mongoose.connection.on("error", (err) => {
//   console.error(err);
// });

(async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})();
// tlpfZw68h5JG7xbz
// k1K8mX2QswT3M9fH
