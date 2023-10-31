const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log('connected');
  socket.on("msg",(data)=>{
    console.log("msg: "+data);
  });
});

httpServer.listen(3000);