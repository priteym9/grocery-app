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

router.use('*', (req, res) => {
    return APIResponseFormat._ResRouteNotFound(res);
});


const getAllRoutes = (app) => {
    app.use("/api/v1", router);
};

module.exports = getAllRoutes;