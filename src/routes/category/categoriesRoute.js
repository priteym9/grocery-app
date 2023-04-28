const express = require('express');
const categoryController = require("../../controllers/category/categoryController.js")
const validateAdminToken = require("../../middlewares/validateAdminToken.js")

const router = express.Router();

router.get('/get-all-categories', categoryController.getAllCategories)
router.post('/add-category', validateAdminToken, categoryController.addCategory)
router.put('/update-category', validateAdminToken, categoryController.updateCategory)
router.delete('/delete-category', validateAdminToken, categoryController.deleteCategory)

module.exports = router;