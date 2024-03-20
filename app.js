const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const Document = require("./Document");

require("dotenv").config(); // Load environment variables

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {}
);

const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});

let count = 0;
const defaultValue = "";
io.on("connection", (socket) => {
  socket.on("getDocument", async (roomID) => {
    const document = await findOrCreateDocument(roomID);
    socket.join(roomID);
    socket.emit("loadDocument", document.data);

    socket.on("sendChanges", (delta) => {
      socket.broadcast.to(roomID).emit("receiveChanges", delta);
    });

    socket.on("saveDocument", async (data) => {
      await Document.findByIdAndUpdate(roomID, { data });
    });
  });

  count++;
  console.log("connected: ", count);

  socket.on("disconnect", () => {
    count--;
    console.log("disconnected: ", count);
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

app.use(cors(corsOptions));
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
