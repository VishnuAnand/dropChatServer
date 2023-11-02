const { createServer } = require("http");
  const { Server } = require("socket.io");
  const { Socket } = require("socket.io-client");


  const httpServer = createServer();
  const io = new Server(httpServer, { /* options */ });

  io.on("connection", (socket) => {
    socketI=socket;
    console.log('connected');
    socket.on("msg",(data)=>{
      console.log("msg: "+data);
    });
    socket.on("file",(data)=>{
      console.log("filename: "+data['name']);
      console.log("content:
------------------------------------------");
      console.log(""+data['data']);
      console.log("
------------------------------------------")
      socket.broadcast.emit("file",data);
    });
    const users = [];

    // socket.on("username",(data)=>{
    //   console.log("username",data);
    //   users.push({
    //     username: data,
    //    // username: socket.handshake.auth.username,
    //   });
    //   console.log("usersarray",users);
    //   socket.emit("username",users);
    // });

    socket.on("username",(data)=>{
      console.log("username recieved",data);
      users.push({
            username: data,
            socketId: socket.id,
        });
      socket.broadcast.emit("username",users);
    });

    // for (let [id, socket] of io.of("/").sockets) {
    //   socket.on("username",(data)=>{
    //     users.push({
    //       userID: id,
    //       username: data,
    //     });
    //     console.log("io.on.username",data);
    //     socket.emit("username", users);
    //   });
    //   console.log("sockets:",id)
    // }


    console.log(users);

    //console.log(socket.handshake.auth.username);
  });







  httpServer.listen(3000);
