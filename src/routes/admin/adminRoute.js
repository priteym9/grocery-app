const express = require('express');
const adminController = require("../../controllers/admin/adminController.js");
const validateAdminToken = require('../../middlewares/validateAdminToken.js');

const router = express.Router();

router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/admin-details', validateAdminToken, adminController.getAdminDetails);

// get all customers
router.get('/get-all-customers', validateAdminToken, adminController.getAllCustomers);


//  block/unblock customer
router.put('/block-customer', validateAdminToken, adminController.blockCustomer);
router.put('/unblock-customer', validateAdminToken, adminController.unblockCustomer);


// delete customer
router.delete('/delete-customer', validateAdminToken, adminController.deleteCustomer);

// get all orders by customer Id
router.get('/get-all-orders-by-id', validateAdminToken, adminController.getCustomerAllOrdersById);

// edit customer
router.put('/edit-customer', validateAdminToken, adminController.editCustomer);

// get all orders
router.get('/get-all-orders', validateAdminToken, adminController.getAllOrders);


module.exports = router;