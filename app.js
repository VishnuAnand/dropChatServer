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
});

httpServer.listen(3000);