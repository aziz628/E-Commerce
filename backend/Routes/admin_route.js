const express =require("express")
const cookieParser=require("cookie-parser")
const middlewares=require("../middlewares/middlewares")
const isAdmin=middlewares.async_handler(middlewares.isAdmin)
const {get_users}=require('../Services/user_services')
const router =express.Router()
const admin_controller=require("../controlers/admin_controller")
const send_template=require('../utils/send_template')
const jwt=require('jsonwebtoken')
const {set_tokens}=require('../Services/tokens_services')

let JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN


router.use(cookieParser())
router.use(express.json())


router.post("/notify_users", isAdmin,admin_controller.send_Notification);
router.post("/notify_user/:user_id", isAdmin,admin_controller.send_notif_per_user);
// since i have no refresh fo admin yet and it was pia while testing i used this 
router.get("/refresh",(req,res)=>{
  console.log("refreshing the tokens ")
  const token=jwt.sign({id:2},JWT_SECRET_ADMIN,{expiresIn:'60m'});
    set_tokens(res,token);
      res.status(200).json({message:"refreshed"})
  })
router.post("/add_product", isAdmin, admin_controller.add_product);
  
router.get("/dashboard", isAdmin, async (req, res) => {
  const users=await get_users();
  users.forEach
  console.log("users",users)
    return send_template(res,"admin_dashboard",{users});
// page can be getten through templates path might not have data for users but might do this
//rendering manualy and put the template in protected folder (out of the path provided for templates)
  });
module.exports=router
