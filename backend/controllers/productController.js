const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');

//Create product -- Admin
exports.createProduct = async (req, res, next) => {

    try {
        const product = await Product.create(req.body);
        console.log("product created")
        res.status(201).json({
            success: true,
            product
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

//Get all products
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
}

//get details of a product 
exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
}

//update product -- admin
exports.updateProduct = async (req, res) => {
    let product = Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
}

//delete product -- Admin

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
    await product.deleteOne({ id: req.params.id });
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
}
