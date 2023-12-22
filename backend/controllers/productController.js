const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');


// Create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);
    console.log("Product created");
    res.status(201).json({
        success: true,
        product
    });
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
});

// Get details of a product 
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

// Update product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });

});

// Delete product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});
