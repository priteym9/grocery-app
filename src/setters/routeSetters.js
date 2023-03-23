const express = require('express');
const categoryRoute = require('../routes/category/categoriesRoute.js');
const customerRoute = require('../routes/customer/customerRoute.js');
const orderRoute = require('../routes/order/orderRoute.js');
const productRoute = require('../routes/product/productRoute.js');
const adminRoute = require('../routes/admin/adminRoute.js');
const CryptoJS = require('crypto-js');
const { sendSuccess, sendError } = require('../utils/sendResponse.js');

const router = express.Router();

router.use('/category', categoryRoute);
router.use('/customer', customerRoute);
router.use('/order', orderRoute);
router.use('/product', productRoute);
router.use('/admin', adminRoute);

router.get('/encryption', (req, res) => {
    const id = req.header('id');
    if (id) {
        sendSuccess(res, 200, true, "Encrypted Id", CryptoJS.AES.encrypt(id, process.env.SECRET_KEY).toString())
    } else {
        sendError(res, 400, false, "Id is required")
    }
});

router.get("/", (req, res) => {
    sendSuccess(res, 200, true, "Welcome to the Grocery Store API")
});

router.use('*', (req, res) => {
    sendError(res, 404, false, "Route does not exist")
});


const getAllRoutes = (app) => {
    app.use("/api/v1", router);
};

module.exports = getAllRoutes;