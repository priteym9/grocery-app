const express = require('express');
const productController = require("../../controllers/product/productController.js");
const validateAdminToken = require('../../middlewares/validateAdminToken.js');

const router = express.Router();

const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../../public/product'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/products'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

router.post('/upload-avatar', upload.single('avatar_image'), productController.uploadImage);

router.get('/get-product-by-id', productController.getProductById)
router.get('/get-product-by-category-id', productController.getProductByCategory)
router.put('/update-product', validateAdminToken, productController.updateProduct)
router.post('/add-product', validateAdminToken, productController.addProduct)

module.exports = router;