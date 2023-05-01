const express = require('express');
const productController = require("../../controllers/product/productController.js");
const validateAdminToken = require('../../middlewares/validateAdminToken.js');

const router = express.Router();

// make a route to upload multiple images
router.post('/upload-images', productController.uploadMultipleImages);
router.post('/upload-avatar', productController.uploadImage);

router.get('/get-product-by-id', productController.getProductById)
router.get('/get-product-by-category-id', productController.getProductByCategory)
router.put('/update-product', validateAdminToken, productController.updateProduct)
router.post('/add-product', validateAdminToken, productController.addProduct)
router.get('/get-all-products', productController.getAllProducts)
router.delete('/delete-product', validateAdminToken, productController.deleteProduct)

// active/inactive product
router.put('/active-product', validateAdminToken, productController.activeProduct)
router.put('/inactive-product', validateAdminToken, productController.inactiveProduct)

module.exports = router;