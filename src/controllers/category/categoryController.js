const db = require('../../db/models/index');
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doDecrypt } = require('../../utils/encryption');
const Categories = db.categories;

// get all categories
const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Categories.findAll({
            attributes: ['id', 'title', 'parent_id', 'slug']
        });
        if (allCategories.length === 0) {
            return APIResponseFormat._ResDataNotExists(res , "Categories not found")

        } else {
            return APIResponseFormat._ResDataFound(res , allCategories)
        }

    } catch (err) {
        return APIResponseFormat._ResServerError(res, err)
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
        if (!title) return APIResponseFormat._ResMissingRequiredField(res, "title");
        if (!parent_id) return APIResponseFormat._ResMissingRequiredField(res, "parent_id");
        // check if parent_id is a number
        if (isNaN(parent_id)) return APIResponseFormat._ResMissingRequiredField(res, "parent_id must be a number")

        if (parent_id === "0") {
            parent_id = null;
        } else {
            const parentCategory = await Categories.findOne({ where: { id: parent_id } });
            if (!parentCategory) return APIResponseFormat._ResDataNotExists(res, "Parent category not found");
        }

        // check if category already exists
        const category = await Categories.findOne({ where: { title } });
        if (category) return APIResponseFormat._ResDataAlreadyExists(res);

        // create category
        const newCategory = await Categories.create({ title, parent_id, slug });
        return APIResponseFormat._ResDataCreated(res, newCategory);

    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
};


// update category
const updateCategory = async (req, res) => {
    try {
        const id = _doDecrypt(req.header('id'));
        const { title, parent_id } = req.body;

        if (!id || !title || !parent_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "All fields");
        } else {
            const findCategory = await Categories.findOne({
                where: {
                    id: id
                }
            });

            if (!findCategory) {
                return APIResponseFormat._ResDataNotExists(res, "Category not found");
            } else {
                const updateCategory = await Categories.update({
                    title,
                    parent_id
                }, {
                    where: {
                        id: id
                    }
                });
                return APIResponseFormat._ResDataUpdated(res, updateCategory);
            }
        }
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

module.exports = {
    getAllCategories,
    updateCategory,
    addCategory,
};
