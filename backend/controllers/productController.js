const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorhandler');
const cloudinary = require("cloudinary")

// Create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imagesLink = [];

    try {
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }

        req.body.images = imagesLink;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("error creating product", error);
        res.status(500).json({
            success: false,
            error: "product creation failed"
        })
    }
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultsPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeature.query

    let filteredProductsCount = products.length

    apiFeature.pagination(resultsPerPage)

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultsPerPage,
        filteredProductsCount,
    });
});

// Get all products -- admin
exports.getAdminProduts = catchAsyncErrors(async (req, res) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
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
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //Images updation starts
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images;
    }

    if(images !== undefined){
        //Deleting images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "pfoducts"
        })    
        
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    req.body.images =  imagesLinks;

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

    //Deleting Images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// Create new review or update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating),
                    (rev.comment = comment);
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
})

//get all reviews of a product
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

//Delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
    //rev._id contains ids of all the reviews
    //queries:- req.query.id = id of the review to be deleted
    //req.query.productId = id of the product

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    let ratings = 0

    if(reviews.length === 0){
        ratings = 0
    }  else {
        ratings = avg/reviews.length
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})
