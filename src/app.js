import express from "express";
import cors from "cors";
const app = express();

console.log("Starting app and setting CORS...");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use((req, res, next) => {
  console.log(`Received request for ${req.method} ${req.url}`);
  next();
});

app.use(
  express.json({
    limit: "16KB",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log("CORS headers:", res.get("Access-Control-Allow-Origin"));
  });
  next();
});
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.get("/", (req, res) => {
  return res.send("Hello World");
});
export { app };
