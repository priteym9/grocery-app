const express = require('express');
const categoryController = require("../../controllers/category/categoryController.js")

const router = express.Router();

router.get('/' , categoryController.categoryPage)
router.get('/get-all-categories' , categoryController.getAllCategories)
router.post('/add-category' , categoryController.addCategory)
router.put('/update-category' , categoryController.updateCategory)


module.exports = router;