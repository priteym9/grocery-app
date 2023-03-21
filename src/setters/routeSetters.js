const express = require('express');
const categoryRoute = require('../routes/category/categoriesRoute.js');
const customerRoute = require('../routes/customer/customerRoute.js');
const orderRoute = require('../routes/order/orderRoute.js');
const productRoute = require('../routes/product/productRoute.js');
const CryptoJS = require('crypto-js');

const router = express.Router();

router.use('/category' , categoryRoute);
router.use('/customer' , customerRoute);
router.use('/order' ,   orderRoute);
router.use('/product' , productRoute);

router.get('/encryption' , (req , res) => {
    res.send(CryptoJS.AES.encrypt(req.header('id'), process.env.SECRET_KEY).toString());
});

router.get("/" , (req , res) => {
    res.status(200).json("Welcome to the Grocery Store API");
});

router.use('*', (req, res) => {
    res.status(404).json("Page not found")
});


const getAllRoutes = (app) => {
    app.use("/api/v1",router);
};

module.exports = getAllRoutes;