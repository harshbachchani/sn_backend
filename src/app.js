import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

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
app.use('/',(req,res)=>{
  res.redirect('https://www.google.co.in/');
})
export { app };
