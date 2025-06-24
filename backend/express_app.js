const express=require('express')
const cors = require('cors');
const path=require('path')
const fs=require("fs")
const users_router= require('./Routes/users_route')
const product_router=require('./Routes/product_route');
const admin_route=require('./Routes/admin_route');
const send_template=require('./utils/send_template')
const helmet=require("helmet")
const morgan=require("morgan");
const middleware =require('./middlewares/middlewares')
const   app=express();


app.set("view engine","ejs")
app.set("views", path.join(__dirname, "../frontend/assets/templates"));
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],  // Change this to your frontend URL if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

app.use('/products',product_router) 

app.use("/users",users_router)  

app.use("/admin",admin_route);


app.use('/css',express.static(path.join(__dirname,"../frontend/assets")))
app.use('/js',express.static(path.join(__dirname,'../frontend/assets/js')))
app.use('/img',express.static(path.join(__dirname,"../frontend/assets/img")))
app.use('/',express.static(path.join(__dirname,"../frontend/assets"))) // for static pages
// for templates 
app.use('/',(req,res,next)=>{
  const file_path=path.join(__dirname,"../frontend/assets/templates",req.url.substring(1)+".ejs");
  if(fs.existsSync(file_path)){
    return send_template(res,req.url.substring(1));
  }
  next();
}) 

app.get('/',(req,res)=>{
  console.log("getting home page");
  send_template(res,"home");
})
app.use('/',(req,res)=>{  
res.status(404).sendFile(path.join(__dirname,"../frontend/assets",'error_page.html'))
})
app.use(middleware.error_handler);


module.exports=app;