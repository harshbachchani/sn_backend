import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app, httpServer } from "./app.js";
import { Notification } from "./models/other/notification.model.js";

connectDB()
  .then((value) => {
    let myport = process.env.PORT || 8000;
    httpServer.on("error", (err) => {
      console.log("Error in running app ", err);
      process.exit(1);
    });
    //only for server function(hosting)
    // cron.schedule("40 12 * * *", async () => {
    //   await Notification.create({
    //     title: "Hello world",
    //     type: "Saving",
    //     role: "User",
    //   });
    // });
    httpServer.listen(myport, () => {
      console.log(`Server is running at ${myport}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
