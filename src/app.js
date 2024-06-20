import express from "express";
import cors from "cors";
import { allowCors } from "./middlewares/cors.middleware.js";
import cookieParser from "cookie-parser";
const app = express();
const allowedOrigins = [
  "https://sn-frontend-sigma.vercel.app/",
  process.env.CORS_ORIGIN,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(allowCors);
app.use(
  express.json({
    limit: "16KB",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(express.static("public"));
app.use(cookieParser());

import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);
app.get("/", (req, res) => {
  return res.send("Hello World");
});
export { app };
