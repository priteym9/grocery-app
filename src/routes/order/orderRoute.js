const express = require('express');
const orderController = require("../../controllers/order/orderController.js")   

const router = express.Router();


router.post('/add-order' , orderController.addOrder)
router.get('/get-order-by-id' , orderController.getOrderById)


module.exports = router;