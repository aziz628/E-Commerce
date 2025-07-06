const http=require('http');
require('dotenv').config({path:"config/.env"}) 
const app=require('./express_app')
const {setupWebSocket} =require("./ws/ws_Server")
const aiService = require('./Services/ai_service');
const server=http.createServer(app);
setupWebSocket(server);




const port=process.env.PORT || 3000

server.listen(port,"0.0.0.0",async ()=>{
    console.log(`Server is running on http://127.0.0.1:${port}`);
    
    // Initialize AI service
    console.log('🤖 Starting AI Autonomous Task Management Service...');
    try {
        await aiService.start();
        console.log('✅ AI service initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize AI service:', error);
    }
})