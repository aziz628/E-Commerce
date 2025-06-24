const express=require('express')
const ejs=require('ejs')
const product_service=require('../Services/products_services')
const path=require('path')
const fs=require('fs')

async function get_products_data(req,res){
    const query = req.query;
    let offset=query?.offset
    let category=query?.category;
    let search=query?.search;
    let filter=query?.filter;
    const result=await product_service.get_products(offset,category,search,filter);
    if(result.count >0){
    let products=result.products
    let number=result.count
    console.log("products exist","number",number)
    return res.status(200).json({products,number}); // show 1-6 products of all pages 
    }else{
    console.log("no products !!")
    res.status(404).json('user not found')
    }
}
const features=["Newest technology",
    "Best in class components",
   "Maintenance free",
    "12 years warranty"
]//pseudo features

async function serve_product_page(req,res){
    try{
let id=req.query.id
console.log(id)
let data= await  product_service.get_product_data(id);
data.features=features
console.log('product is ',data)
res.render("product",data);
}catch(err){
    console.error(err)
    res.status(500).json("internal server error")
}
}


module.exports={get_products_data,serve_product_page}