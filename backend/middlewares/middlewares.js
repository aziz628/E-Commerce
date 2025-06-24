const jwt=require('jsonwebtoken')
const crypto = require('crypto');
const path=require("path")
const{save_token,delete_token,get_token,generate_access_token,clear_tokens,generate_reset_token
    ,generate_refresh_tokken,set_tokens}=require('../Services/tokens_services')
let JWT_SECRET=process.env.JWT_SECRET
let JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN
let JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET


function isAdmin(req, res, next) {
    const token =req.cookies.token
    try{
    const {id}=jwt.verify(token,JWT_SECRET_ADMIN)
    req.admin_id =id;
    next();
    }catch(err){
        console.warn(err)
        res.status(404).sendFile(path.join(__dirname,"../../frontend/assets",'error_page.html'))
    }
  }
  


// authenticate tokens


async function authenticate(req,res,next) {
    const token = req.cookies.token;  // Access token from cookies
    const refresh_token = req.cookies.refresh_token;  // Refresh token from cookies
    if (token) {
        try {
            console.log('verify tokken');
            let {id}= jwt.verify(token, JWT_SECRET);
            if (!id) throw new Error("Invalid token payload");
            req.user_id=id;
            return next();
        }catch (err){
            console.log('Invalid access token');//expected
        }      
    }
    if(refresh_token){
        console.log('verify refresh');
        req.user_id= await verify_refresh_token(refresh_token,res);//return id 
        return next();
    }else{ 
    console.error("Unauthorized: Missing refresh token")
    return res.status(401).json({ error: "Unauthorized " });
        }

}

async function verify_refresh_token(refresh_token,res){
let decoded_token=jwt.verify(refresh_token, JWT_REFRESH_SECRET);//check for secret key
if (!decoded_token.id) {
    throw  Object.assign(new Error("Unauthorized: Token missing user ID"), { statusCode: 401 });
}
// for throwed errors there a solution is to console them in error middleware and map what to send to user or just reduce the message or find something else
let db_token=await get_token(refresh_token,"refresh_tokens"); //get from db to protect against manipulation
if (db_token && db_token.expires_at > Date.now()) {
return await rotate_tokens(db_token,res);
}
throw  Object.assign(new Error('Unauthorized invalid refresh token'), { statusCode: 401 });
}
async function rotate_tokens(decoded,res){
        const id=decoded.user_id
        let new_access_token = generate_access_token(id);
        let new_refresh_token = generate_refresh_tokken(id);
        await delete_token(id,"refresh_tokens");
        await save_token( id,new_refresh_token,"refresh_tokens");
        set_tokens(res, new_access_token, new_refresh_token);
        return id;
}  



function error_handler(err, req, res, next) {
    console.error(" Error:", err );
    const statusCode = err.statusCode || 500;   
    res.status(statusCode).json({ error: err.message || "Internal Server Error" });
}
function async_handler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

      
module.exports={authenticate,error_handler,async_handler,isAdmin}