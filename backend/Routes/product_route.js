
const express =require("express")
const product_controller=require("../controlers/product_controler")
const router =express.Router()


router.get("/product_page",product_controller.serve_product_page)
router.get("/shoping",product_controller.get_products_data)


module.exports=router

