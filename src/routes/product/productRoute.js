const express = require('express');
const productController = require("../../controllers/product/productController.js");
const validateAdminToken = require('../../middlewares/validateAdminToken.js');

const router = express.Router();


router.get('/get-product-by-id', productController.getProductById)
router.get('/get-product-by-category-id', productController.getProductByCategory)
router.put('/update-product', validateAdminToken, productController.updateProduct)
router.post('/add-product', validateAdminToken, productController.addProduct)

module.exports = router;