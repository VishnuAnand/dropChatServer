const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");
socket.on("connect", () => {
    const engine = socket.io.engine;
    console.log(engine.transport.name); // in most cases, prints "polling"
  
    engine.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      console.log(engine.transport.name); // in most cases, prints "websocket"
    });
  
    engine.on("packet", ({ type, data }) => {
      // called for each packet received
    });
  
    engine.on("packetCreate", ({ type, data }) => {
      // called for each packet sent
    });
  
    engine.on("drain", () => {
      // called when the write buffer is drained
    });
  
    engine.on("close", (reason) => {
      // called when the underlying connection is closed
    });
});

socket.emit("msg", { a: "b", c: [] });