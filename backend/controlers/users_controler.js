const jwt=require('jsonwebtoken')
const {Search,addUser,update_user,delete_user_account,reset_password}=require('../Services/user_services')
const {generate_reset_token,save_token,delete_token,get_token,clear_tokens,generate_access_token,set_tokens,generate_refresh_tokken}=require('../Services/tokens_services')

const {send_reset_email}=require('../Services/email_service')
let JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN
let JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET

function admin_login(res,user){
     console.log("admin ",user)
    const token=jwt.sign({id:user.id},JWT_SECRET_ADMIN,{expiresIn:'60m'});
    set_tokens(res,token);
    return res.status(200).json({message:"login successfully",role:"admin"})       
}

async function signup(req,res){
    try{
    let user=req.body//not sure here verify others as well for non body parameters since middleware don't return
    let result=await Search(user,true)
    console.log(result)
    if(result?.id){
        console.log("already exist")
        return res.status(409).json({error:"User found, try another email"}) // status code for conflict
    } else {
    const user_id= await addUser(user)
    console.log('new user id : ',user_id)
    if(user_id>=0){
        return res.status(200).json({message:"user added",id:user_id})  
    }else{     return res.status(500).json({error:'Internal Server Error'})
    }
    }
    }catch(err){
        console.error(err)
        return res.status(500).json({error:'Internal Server Error'})
    }
}

async function login(req,res){
    try{
        const user=req.body
        const result = await Search(user); console.log('search for user',result) //thinking of seperate email and pass search
        if(! result?.id)return res.status(404).json({error:'user not found'})
        if(result=="Incorrect password") return res.status(400).json('Incorrect password')
        if(result.role=="admin")return admin_login(res,result)
        const token=generate_access_token(result.id);
        const refresh_token=generate_refresh_tokken(result.id); //console.log('created access tokken ',tokken); console.log("created refresh_token",refresh_token);
        await save_token(result.id,refresh_token,"refresh_tokens")
        set_tokens(res,token,refresh_token);
        res.status(200).json("login successfully")       
   }catch(err){
       console.error('Error in handle_Signin:', err);
       return res.status(500).json({error:'Internal Server Error'})
   }

}
async function update(req,res){
        try{
        const id=req.user_id;
        const {new_data}=req.body
            // check old value first
            let changes =await  update_user(id,new_data);
            if (changes== 0){
                console.log("update failed")
                return res.status(500).json({error:'Internal Server Error'})

            }else{
                res.status(200).json({message:'data updated'})
            }
    }catch(err){
        if(err.message=="same credentials"){ //put it in error middleware
            res.status(409).json("same credentials")
            console.log('same credentials error')
            return
        }
        console.error(err)
        return res.status(500).json({error:'Internal Server Error'})
        }

    }

async function delete_account(req,res){
    try{
    const id= req.user_id;// user here is decoded token object
    const changes=await delete_user_account(id)
    console.log("user deleted ",changes)
    if (changes>0) {
         res.status(200).json({message:'user deleted'})
        console.log('deleting response sent')
    } else {
        console.log('user not found')
        res.status(404).json('User not found')
       return
    }
}catch(err){
        console.error(err.message)
        return res.status(500).json({error:'Internal Server Error'})
    }
}

    
async function logout(req,res){
        try{
            /*handle log out with only refresh token cause both tokens will be removed (from log out) either way  after  you create new token from the refresh *///error handled inside get_cookies i wonder if this right approach
            const refresh_token = req.cookies.refresh_token; 
             console.log("refresh_token from logout : ",refresh_token)
             if(!refresh_token){//maybe can be optimized
                console.log('invalid refresh token');
                res.status(401).json({error:'Invalid token'});return
             }
                console.log("refresh token exist")
                try{
                result=jwt.verify(refresh_token, JWT_REFRESH_SECRET);//do i need return ?
                console.log("valid refresh result",result);
                }catch(err){     
                    console.error(err)
                    console.log('invalid refresh token')
                    clear_tokens(res);// clear tokens anyway to not send invalid tokens
                    await delete_token(result.id,"refresh_tokens")
                    res.status(401).json({error:'Invalid refresh token'});return
                }
                clear_tokens(res)//empty tokens
                await delete_token(result.id,"refresh_tokens")
                res.status(200).json('Logged out successfully')
                console.log("logout response sent ")
                return 
        }catch(err){
            console.log("can't logout") 
            console.error(err)
            return res.status(500).json({error:'Internal Server Error'})        
        }
    }

async function handle_password_loss(req, res) {
    try {
        const { email } = req.body;
        console.log("searching")
        let id = (await Search({ email }, true))?.id ; 
        console.log("id ",id) // Search user by email
        if (id && id >= 0) {
            await delete_token(id,"reset_tokens");  // Remove old reset tokens
            let token = generate_reset_token();
            await save_token(id, token,"reset_tokens");
            await send_reset_email(email , token,"reset");
        }else{
           return res.status(400).json({ message: "failed email sending " });
        }

        res.status(200).json({ message: " a reset link has been sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error." });
    }
}
async function handle_password_reset(req, res) {
        const { reset_token , password } = req.body;
        let row = await get_token(reset_token,"reset_tokens");
        if (!row) {
            return res.status(404).json({ error: "Invalid reset token" });
        }
        const { user_id, expires_at } = row;
        console.log('id ',user_id,"expire ",expires_at)
        if (expires_at < Date.now()) {
            await delete_token(user_id,"reset_tokens");
            return res.status(400).json({ error: "Reset token expired" });
        }
        let changes = await reset_password(user_id, password);
        if (changes === 0) {
            return res.status(500).json({ error: "Failed to reset password" });
        }

        await delete_token(user_id,"reset_tokens");
        res.json({ message: "Password reset successfully" });
}
    
module.exports={signup,login,logout,delete_account,update,handle_password_loss,handle_password_reset}