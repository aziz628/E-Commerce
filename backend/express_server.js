const http=require('http');
require('dotenv').config({path:"config/.env"}) 
const app=require('./express_app')
const {setupWebSocket} =require("./ws/ws_Server")
const server=http.createServer(app);
setupWebSocket(server);




const port=process.env.PORT

server.listen(port,"0.0.0.0",()=>{
    console.log(`Server is running on http://127.0.0.1:${port}`);
})