const CryptoJS = require('crypto-js');
const db = require('../../db/models/index.js');

const Product = db.products;
const ProductCategory = db.product_categories;
const productPage = async (req, res) => {
    res.send("product page");
}

// add product
const addProduct = async (req, res) => {
    res.send("add product");
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
    res.send("update product");
}

module.exports = {
    productPage,
    getProductById,
    getProductByCategory,
    updateProduct,
    addProduct
}