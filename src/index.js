import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app, server } from "./app.js";

connectDB()
  .then((value) => {
    let myport = process.env.PORT || 8000;
    server.on("error", (err) => {
      console.log("Error in running app ", err);
      process.exit(1);
    });

    server.listen(myport, () => {
      console.log(`Server is running at ${myport}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
