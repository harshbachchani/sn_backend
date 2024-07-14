import { createServer } from "http";
import express from "express";
import cors from "cors";
const app = express();
const httpServer = createServer(app);

import { errHandler } from "./middlewares/err.middleware.js";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(
  express.json({
    limit: "16KB",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(express.static("public"));

import adminRouter from "./routes/admin/admin.routes.js";
import userRouter from "./routes/user/user.routes.js";

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.get("/", async (req, res) => {
  return res.send("Hello World");
});

app.use(errHandler);

export { app, httpServer };
