const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorhandler');


// Create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    console.log("Product created");
    res.status(201).json({
        success: true,
        product
    });
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
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
