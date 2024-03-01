const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllReviews, deleteReview, getAdminProduts } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route('/products').get(getAllProducts)

router.route('/admin/products').get( isAuthenticatedUser, authorizeRoles("admin"), getAdminProduts)

router.route('/product/:id').get(getProductDetails)

router.route('/products/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route('/products/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)

router.route('/products/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route('/review/').put(isAuthenticatedUser, createProductReview)

router.route('/reviews/').get(getAllReviews)

router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

module.exports = router 