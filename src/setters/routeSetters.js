const express = require('express');
const categoryRoute = require('../routes/category/categoriesRoute.js');
const customerRoute = require('../routes/customer/customerRoute.js');
const orderRoute = require('../routes/order/orderRoute.js');
const productRoute = require('../routes/product/productRoute.js');
const adminRoute = require('../routes/admin/adminRoute.js');
const paymentStatusRoute = require('../routes/paymentStatus/paymentStatusRoute.js');
// const { sendSuccess, sendError } = require('../utils/sendResponse.js');
const APIResponseFormat = require('../utils/APIResponseFormat');
const { _doEncrypt , _doDecrypt } = require('../utils/encryption.js');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.use('/category', categoryRoute);
router.use('/customer', customerRoute);
router.use('/order', orderRoute);
router.use('/product', productRoute);
router.use('/payment-status' , paymentStatusRoute);
router.use('/admin', adminRoute);

router.get('/encryption', (req, res) => {
    const id = req.header('id');
    if (id) {
        const encryptedId = _doEncrypt(id);
        return APIResponseFormat._ResDataFound(res, encryptedId);
    } else {
        return APIResponseFormat._ResMissingRequiredField(res, "Id");
    }
});

router.get('/decryption', (req, res) => {
    const id = req.header('id');
    if (id) {
        const decryptedId = _doDecrypt(id);
        return APIResponseFormat._ResDataFound(res, decryptedId);
    } else {
        return APIResponseFormat._ResMissingRequiredField(res, "Id");
    }
});

router.get("/", (req, res) => {
    return APIResponseFormat._ResDataFound(res, "Welcome to the API");
});

// get image from public folder
router.get('/get-image/:imgName', (req, res) => {
    try{
        const imgName = req.params.imgName
        if(!imgName){
            return APIResponseFormat._ResMissingRequiredField(res, 'image name is required');
        }
        let filePath = path.join(__dirname, '../', 'public', 'products', imgName);

        if(fs.existsSync(filePath)){
            // return image from path
            return res.sendFile(filePath);
        }else{
            // return default image
            return res.sendFile(path.join(__dirname, '../', 'public', 'products', 'default.png'));
        }
        // return APIResponseFormat._ResDataFound(res, 'Welcome to the API');
    }catch(err){
        return APIResponseFormat._ResServerError(res, err);
    }
});


router.use('*', (req, res) => {
    return APIResponseFormat._ResRouteNotFound(res);
});


const getAllRoutes = (app) => {
    app.use("/api/v1", router);
};

module.exports = getAllRoutes;