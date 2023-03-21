const categoryPage = (req, res) => {
    res.send("category page")
}

// get all categories
const getAllCategories = (req, res) => {
    res.send("all categories")
}

// add category
const addCategory = (req, res) => {
    res.send("add category")
}

// update category
const updateCategory = (req, res) => {
    res.send("update category")
}



module.exports = {
    categoryPage,
    getAllCategories,
    updateCategory,
    addCategory
}