import dotenv from "dotenv";
import cron from "node-cron";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app, httpServer } from "./app.js";

connectDB()
  .then((value) => {
    let myport = process.env.PORT || 8000;
    httpServer.on("error", (err) => {
      console.log("Error in running app ", err);
      process.exit(1);
    });
    // cron.schedule("*/10 * * * * *", () => {
    //   console.log("running every minute 1, 2, 4 and 5");
    // });
    httpServer.listen(myport, () => {
      console.log(`Server is running at ${myport}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
