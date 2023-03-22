const db = require("../../db/models/index");
const Category = db.categories;
const Product = db.products;
const ProductCategory = db.product_categories;
const CryptoJS = require("crypto-js");


// add product
const addProduct = async (req, res) => {

    let { title, amount, discount_type, discount_amount, avatar_image, images, short_description, description } = req.body;
    let category_id = CryptoJS.AES.decrypt(req.header('category_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

    try {
        // for loop for checking all fields are not empty
        for (let key in req.body) {
            if (req.body[key] === "") return res.status(400).json({ success: false, message: `${key} is required` });
        }
        // check if category_id is a number
        if (isNaN(category_id)) return res.status(400).json({ success: false, message: "Category id must be a number" });

        // check if category exists
        const category = await Category.findOne({ where: { id: category_id } });
        if (!category) return res.status(400).json({ success: false, message: "Category does not exist" });

        // check if product already exists
        const product = await Product.findOne({ where: { title } });
        if (product) return res.status(400).json({ success: false, message: "Product already exists" });

        //  crearte product and insert data into it and also insert category_id in product_category table
        const newProduct = await Product.create({ title, amount, discount_type, discount_amount, avatar_image, images, short_description, description, category_id });
        if (newProduct) {
            // insert inserted product's id and  category_id in product_category table
            const productCategory = await ProductCategory.create({ product_id: newProduct.id, category_id });
            if (productCategory) return res.status(201).json({ success: true, message: "Product created successfully", result: newProduct });
        }
    } catch (error) {
        return res.status(500).json({ success: true, message: "Internal server error", error: error.message });
    }
}

// get product by id
const getProductById = async (req, res) => {
    // Get Product details by Product Id
    if(!req.header('id')){
        return res.status(400).json({
            success : false,
            message : "Product Id is required",
        });
    }
    try{
        const product = await Product.findOne({
            where: {
                id: CryptoJS.AES.decrypt(req.header('id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            }
        });
        if(product){
            return res.status(200).json({
                success : true,
                message : "Product fetched successfully",
                result : product
            });
        }else{
            return res.status(200).json({
                success : false,
                message : "Product not found",
                result : null
            });
        }
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.errors[0].message ,
            message1 : 'lol'
        });
    }
}

// Get All Products by Category Id
const getProductByCategory = async (req, res) => {
    try{
        if(!req.header('category_id')){
            return res.status(400).json({
                success : false,
                message : "Category Id is required",
            });
        }

        // Get All Products by Category Id join with product_categories table
        const products = await ProductCategory.findAll({
            where: {
                category_id: CryptoJS.AES.decrypt(req.header('category_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)
            },
            attributes: ['id','product_id' , 'category_id'],
            include: [
                {
                    model: Product,
                    as: "product",
                }
            ]
        });

        if(products){
            return res.status(200).json({
                success : true,
                message : "Products fetched successfully",
                result : products
            });
        }else{
            return res.status(200).json({
                success : false,
                message : "Products not found",
                result : null
            });
        }


}
    catch(error){
        return res.status(500).json({
            success : false,
            msg : 'excuting - stop' ,
            message : "Internal Server Error",
            error : error
        });
    }
}

// update product
const updateProduct = async (req, res) => {
    let { title, amount, discount_type, discount_amount, avatar_image, images, short_description, description } = req.body;
    let category_id = CryptoJS.AES.decrypt(req.header('category_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    let product_id = CryptoJS.AES.decrypt(req.header('product_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try {
        // for loop for checking all fields are not empty
        for (let key in req.body) {
            if (req.body[key] === "") return res.status(400).json({ success: false, message: `${key} is required` });
        }
        // check if category_id is a number
        if (isNaN(category_id)) return res.status(400).json({ success: false, message: "Category id must be a number" });

        // check if product_id is a number
        if (isNaN(product_id)) return res.status(400).json({ success: false, message: "Product id must be a number" });

        // check if category exists
        const category = await Category.findOne({ where: { id: category_id } });
        if (!category) return res.status(400).json({ success: false, message: "Category does not exist" });

        // check if product already exists
        const product = await Product.findOne({ where: { id: product_id } });
        if (!product) return res.status(400).json({ success: false, message: "Product does not exist" });

        // update product
        const updatedProduct = await Product.update({ title, amount, discount_type, discount_amount, avatar_image, images, short_description, description, category_id }, { where: { id: product_id } });
        if (updatedProduct){
            // update category_id in product_category table
            const productCategory = await ProductCategory.update({ category_id }, { where: { product_id } });
            if (productCategory) return res.status(200).json({ success: true, message: "Product updated successfully", result: updatedProduct });
        }   
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

module.exports = {
    getProductById,
    getProductByCategory,
    updateProduct,
    addProduct
}