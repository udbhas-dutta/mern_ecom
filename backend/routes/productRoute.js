const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route('/products').get(getAllProducts)

router.route('/products/:id').get(getProductDetails)

router.route('/products/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route('/products/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)

router.route('/products/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route('/review/').put(isAuthenticatedUser, createProductReview)

module.exports = router 