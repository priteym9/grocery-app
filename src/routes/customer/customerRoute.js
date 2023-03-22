const express = require('express');
const customerController = require("../../controllers/customer/customerController.js")

const router = express.Router();


router.post('/add-customer' , customerController.addCustomer)
router.post('/add-customer-address' , customerController.addCustomerAddress)
router.get('/get-customer-all-orders' , customerController.getCustomerAllOrders)

module.exports = router;