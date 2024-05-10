import express from "express";

import { Server } from "socket.io";

import cors from "cors";
import http, { createServer } from "http";
import { connect } from "./config.js";
import { chatModel } from "./chat.Schema.js";

const app = express();

// 1. Create server using http

const server = http.createServer(app);

// 2. create socket server

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 3. use Socket events

io.on("connection", (socket) => {
  console.log("connection is establish");

  socket.on("join", (data) => {
    socket.username = data;
  });

  socket.on("new_message", (message) => {
    let userMessage = {
      username: socket.username,
      message: message,
    };

    const newChat = new chatModel({
        username:socket.username,
        message:message,
        timestamp:new Date()
    });
    newChat.save();
    // broadcast the message to all clients
    socket.broadcast.emit("broadcast_message", userMessage);
  });

  socket.on("disconnect", () => {
    console.log("Connection is disconnect");
  });
});

server.listen(3000, () => {
  console.log("App is listening on 3000");
  connect();
});
