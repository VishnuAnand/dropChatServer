const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log('connected');
  socket.on("msg",(data)=>{
    console.log("msg: "+data);
  });
  socket.on("file",(data)=>{
    console.log("filename: "+data['name']);
    console.log("content:\n------------------------------------------");
    console.log(""+data['data']);
    console.log("\n------------------------------------------")
    socket.emit("file",data);
  });
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  console.log(socket.id);
  socket.emit("users", users);
  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
  console.log(socket.userID);
  console.log(socket.username);
});



httpServer.listen(3000);