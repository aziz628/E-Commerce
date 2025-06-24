const WebSocket = require("ws");
const { verifyWebSocketClient } = require("./wsAuth");
const routeMessage = require("./wsMessageRouter");
const active_users=new Set()
function handle_buffer(message){
  if (Buffer.isBuffer(message)) {
      // If it's a Buffer, convert it to a string (assuming UTF-8 encoding)
      console.log('raw message',message);
      message = message.toString('utf-8');
      console.log('converted to json',message)
    }
  return message
}
//  Accepts an existing HTTP server (from Express)
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, verifyClient: verifyWebSocketClient });
  //  When a client connects
  wss.on("connection", (ws, req) => {
    //  We previously set `req.user` in the verifyClient
    active_users.add(ws)
    ws.user_id = req.user.id;
    console.log(" WS Connected with user:", ws.user_id);

    // Listen for messages and route them
    ws.on("message", (message) => {
      routeMessage(ws, handle_buffer(message)); //  Goes to a router that picks the right function
    });

    ws.on("close", () => {
      active_users.delete(ws)
      console.log("WS Disconnected:", ws.user_id);
      // No need to remove from map, because we’re not using one (your style)
    });
  });
}


//notification mark seen 
module.exports = { setupWebSocket,active_users};
