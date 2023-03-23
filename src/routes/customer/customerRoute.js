const express = require('express');
const customerController = require("../../controllers/customer/customerController.js")

const router = express.Router();


router.get('/login' , customerController.login)
router.post('/register' , customerController.register)
router.post('/add-customer-address' , customerController.addCustomerAddress)
router.get('/get-customer-all-orders' , customerController.getCustomerAllOrders)
router.put('/update-customer' , customerController.updateCustomer)

module.exports = router;