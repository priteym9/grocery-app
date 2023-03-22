const db = require("../../db/models/index");
const Category = db.catagories;

const categoryPage = (req, res) => {
    res.send("category page");
};

// get all categories
const getAllCategories = (req, res) => {
    res.send("all categories");
};

// add category
const addCategory = async (req, res) => {
    const { title, parent_id } = req.body;
    try {
        if (!title) return res.status(400).json({ success: false, message: "Title is required" });
        if (!parent_id) return res.status(400).json({ success: false, message: "Parent category is required" });
        // check if parent_id is a number
        if (isNaN(parent_id)) return res.status(400).json({ success: false, message: "Parent category must be a number" });

        if (parent_id === "0") {
            parent_id = null;
        } else {
            const parentCategory = await Category.findOne({ where: { id: parent_id } });
            if (!parentCategory) return res.status(400).json({ success: false, message: "Parent category does not exist" });
        }

        // check if category already exists
        const category = await Category.findOne({ where: { title } });
        if (category) return res.status(400).json({ success: false, message: "Category already exists" });

        // create category
        const newCategory = await Category.create({ title, parent_id });
        return res.status(201).json({ success: true, message: "Category created successfully", result: newCategory });

    } catch (error) {
        return res.status(500).json({ success: true, message: "Internal server error", error: error.message });
    }
};

// update category
const updateCategory = (req, res) => {
    res.send("update category");
};

module.exports = {
    categoryPage,
    getAllCategories,
    updateCategory,
    addCategory,
};
