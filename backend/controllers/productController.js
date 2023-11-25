const Product = require('../models/productModel')

//Create product
exports.createProduct = async (req,res,next)=>{

    try {
        const product = await Product.create(req.body);
        console.log("product created")
        res.status(201).json({
            success:true,
            product
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:'Internal server error'
        })
    }
}


exports.getAllProducts = (req,res) =>{
    
    res.status(200).json({message:"route is working fine"})
}