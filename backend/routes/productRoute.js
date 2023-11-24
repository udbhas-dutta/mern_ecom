const express = require("express");
const { getAllProducts } = require("../controllers/ProductController");

const router = expres.Router();

router.route('/products').get(getAllProducts)

module.exports = router