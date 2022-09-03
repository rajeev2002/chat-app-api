const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const friendInvitationsRoutes = require("./routes/friendInvitationsRoutes");

const app = express();
const socketServer = require("./socketServer");

const port = process.env.PORT || 8000;

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to Database."));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationsRoutes);

server.listen(port, () => console.log("server started."));
