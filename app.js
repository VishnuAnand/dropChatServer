const express = require('express');
const mongoose = require('mongoose');
const {createServer} = require('http');
const {Server} = require('socket.io');
const File = require("./models/File");

const fileRoutes = require("./routes/fileRoutes");
const { error } = require('console');

// Connect to MongoDB
mongoose.connect("mongodb+srv://bijil:E3wttXF5rMM3gkYZ@cluster0.rj9atia.mongodb.net/dropchat?retryWrites=true&w=majority").then(con => {
    console.log( "DB connection successfull" )
}).catch(err => console.log(err.message))



const app = express();

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });


var usersList = new Map();

io.on("connection", (socket) => {

    let event_socket_id = socket.id;

    socket.on('file', async(data)=> {
        console.log("File Recieved:", data);

        hash = data.hash;
        const file_data = await File.find({hash:hash});

        console.log("Fetched from DB:", file_data);

        socket.broadcast.emit("file",file_data);
    });

    //User connected with username
    socket.on('username',(data)=>{

        usersList.set(event_socket_id,data);
        let usersObj = Object.fromEntries(usersList);

        console.log('User connected',data);

        //var usersWithoutSender= usersList;
        //usersWithoutSender.delete(event_socket_id);

        console.log('User connected user list',usersList);

        socket.emit("username",usersObj);
        socket.broadcast.emit("username",usersObj);

    });

    socket.on("disconnect", (reason) => {
        usersList.delete(event_socket_id);
        console.log("User disconnected new users list: ",usersList);

        let usersObj = Object.fromEntries(usersList);

        socket.emit("username",usersObj);
        socket.broadcast.emit("username",usersObj);

      });
})


app.use("/api",fileRoutes);


const port = 3001;
app.listen(port,() => {
    console.log(`Server running on port:${port}`);
})

httpServer.listen(3000,() => {
    console.log(`Socket Server running on port:3000`);
})


