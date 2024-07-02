import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});
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

import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use(errHandler);
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Emit example for account creation (use this in your routes where needed)
// export const emitNewAccountRequest = (data) => {
//   io.emit("newAccountRequest", data);
// };
export { app, server };
