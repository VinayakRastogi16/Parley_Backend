import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"
import router from "./routes/users.routes.js"
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}))

app.use("/api/v1/users", router)

const start = async () => {
  const connectionDB = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MONGO connected DB Host: ${connectionDB.connection.host}`)

  server.listen(app.get("port"), () => {
    console.log(`Server listening at port ${app.get("port")}`);
  });
};

start();
