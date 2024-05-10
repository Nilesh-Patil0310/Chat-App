import express from "express";

import { Server } from "socket.io";

import cors from 'cors';
import http, { createServer } from 'http';

const app = express();

// 1. Create server using http

const server = http.createServer(app);

// 2. create socket server

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

// 3. use Socket events

io.on('connection', (socket)=>{
    console.log("connection is establish");

    socket.on('new_message', (message)=>{
        // broadcast the message to all clients
        socket.broadcast.emit('broadcast_message',message);
    })

    socket.on('disconnect', ()=>{
        console.log("Connection is disconnect")
    })
});

server.listen(3000, ()=>{
    console.log("App is listening on 3000")
})