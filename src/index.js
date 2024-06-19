import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then((value) => {
    let myport = process.env.PORT || 8000;
    app.on("error", (err) => {
      console.log("Error in running app ", err);
      process.exit(1);
    });
    app.listen(myport, () => {
      console.log(`Server is running at ${myport}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
