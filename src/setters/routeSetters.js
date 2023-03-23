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
    const id = req.header('id');
    if(id){
        res.status(200).send(CryptoJS.AES.encrypt(id, process.env.SECRET_KEY).toString());
    }else{
        res.status(400).json("Id is required");
    }
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