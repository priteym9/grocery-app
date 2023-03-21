const productPage = async (req, res) => {
    res.send("product page");
}

// add product
const addProduct = async (req, res) => {
    res.send("add product");
}

// get product by id
const getProductById = async (req, res) => {
    res.send("get product by id");
}

// get product by category
const getProductByCategory = async (req, res) => {
    res.send("get product by category");
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