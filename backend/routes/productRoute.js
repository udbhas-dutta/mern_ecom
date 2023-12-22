const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/ProductController");

const router = express.Router();

router.route('/products').get(getAllProducts)

router.route('/products/:id').get(getProductDetails)

router.route('/products/new').post(createProduct)

router.route('/products/:id').put(updateProduct)

router.route('/products/:id').delete(deleteProduct)


module.exports = router 