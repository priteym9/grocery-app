const express = require('express');
const adminController = require("../../controllers/admin/adminController.js")

const router = express.Router();

<<<<<<< HEAD
router.get('/login' , adminController.login)
router.get('/register' , adminController.register)
=======
router.post('/login', adminController.login);
router.post('/register', adminController.register);

>>>>>>> 43782edfa2b772b5ead0bfae1803128c55c5a0fb

module.exports = router;