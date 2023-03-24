const db = require('../../db/models/index');
const { sendError, sendSuccess } = require('../../utils/sendResponse');
const { _doDecrypt } = require('../../utils/encryption');
const Categories = db.categories;

// get all categories
const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Categories.findAll({
            attributes: ['id', 'title', 'parent_id']
        });
        if (allCategories.length === 0) {
            return sendError(res, 400, false, "No categories found")
        } else {
            return sendSuccess(res, 200, true, "Categories found", allCategories)
        }

    } catch (err) {
        return sendError(res, 500, false, "Something went wrong", err)
    }
}


// add category
const addCategory = async (req, res) => {
    let { title, parent_id } = req.body;
    const slug = title.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    try {
        if (!title) return sendError(res, 400, false, "Category title is required");
        if (!parent_id) return sendError(res, 400, false, "Parent category is required");
        // check if parent_id is a number
        if (isNaN(parent_id)) return sendError(res, 400, false, "Parent category must be a number");

        if (parent_id === "0") {
            parent_id = null;
        } else {
            const parentCategory = await Categories.findOne({ where: { id: parent_id } });
            if (!parentCategory) return sendError(res, 400, false, "Parent category does not exist");
        }

        // check if category already exists
        const category = await Categories.findOne({ where: { title } });
        if (category) return sendError(res, 400, false, "Category already exists");

        // create category
        const newCategory = await Categories.create({ title, parent_id, slug });
        return sendSuccess(res, 201, true, "Category created successfully", newCategory);

    } catch (error) {
        return sendError(res, 500, false, "Something went wrong", error);
    }
};


// update category
const updateCategory = async (req, res) => {
    try {
        const id = _doDecrypt(req.header('id'));
        const { title, parent_id } = req.body;

        if (!id || !title || !parent_id) {
            return sendError(res, 400, false, "All fields are required");
        } else {
            const findCategory = await Categories.findOne({
                where: {
                    id: id
                }
            });

            if (!findCategory) {
                return sendError(res, 400, false, "Category not found");
            } else {
                const updateCategory = await Categories.update({
                    title,
                    parent_id
                }, {
                    where: {
                        id: id
                    }
                });
                return sendSuccess(res, 200, true, "Category updated successfully", updateCategory);
            }
        }
    } catch (err) {
        return sendError(res, 500, false, "Something went wrong", err);
    }
}

module.exports = {
    getAllCategories,
    updateCategory,
    addCategory,
};
