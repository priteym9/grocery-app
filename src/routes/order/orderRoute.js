const express = require('express');
const orderController = require("../../controllers/order/orderController.js");
const validateUserToken = require('../../middlewares/validateUserToken.js');

const router = express.Router();


router.post('/add-order', validateUserToken, orderController.addOrder)
router.get('/get-order-by-id', validateUserToken, orderController.getOrderById)


module.exports = router;