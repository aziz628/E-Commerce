const express =require("express")
const middlewares=require("../middlewares/middlewares")
const cookieParser=require("cookie-parser")
const authenticate=middlewares.async_handler(middlewares.authenticate)
const handler=require("../utils/async_handlers")

const user_controller_raw=require("../controlers/users_controler")
user_controller=handler.async_controller(user_controller_raw)

const router =express.Router()
router.use(express.json())

router.post("/login",user_controller.login)
router.post("/signup",user_controller.signup)

router.use(cookieParser())
router.get("/refresh",(req,res,next)=>{
console.log("refreshing the tokens ")
next()
},authenticate,(req,res)=>{
    res.status(200).json({message:"refreshed"})
})
router.delete("/delete_account",authenticate,user_controller.delete_account)
router.put("/update",authenticate,user_controller.update)
router.post("/logout",authenticate,user_controller.logout)
router.post("/password_loss",user_controller.handle_password_loss)
router.post("/reset_password",user_controller.handle_password_reset)

module.exports=router
