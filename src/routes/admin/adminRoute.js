const express = require('express');
const adminController = require("../../controllers/admin/adminController.js");
const validateAdminToken = require('../../middlewares/validateAdminToken.js');

const router = express.Router();

router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/admin-details', validateAdminToken, adminController.getAdminDetails);

module.exports = router;