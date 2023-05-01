const db = require('../../db/models/index');
const APIResponseFormat = require('../../utils/APIResponseFormat');
const { _doDecrypt } = require('../../utils/encryption');
const Categories = db.categories;
const ProductCategories = db.product_categories;

// get all categories
const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Categories.findAll({
            // attributes: ['id', 'title', 'parent_id', 'slug']
        });
        if (allCategories.length === 0) {
            return APIResponseFormat._ResDataNotExists(res, "Categories not found")

        } else {
            return APIResponseFormat._ResDataFound(res, allCategories)
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

        // use findOrCreate to check if category already exists and create if it doesn't exist
        const [newCategory, created] = await Categories.findOrCreate({
            where: { title },
            paranoid: false,
            defaults: { title, parent_id, slug }
        });

        if (created === false && newCategory.deleted_at === null) {
            return APIResponseFormat._ResDataAlreadyExists(res);
        }

        if (created === false && newCategory.deleted_at !== null) {
            await Categories.restore({ where: { id: newCategory.id } });
            await Categories.update({ title, parent_id, slug }, { where: { id: newCategory.id } });

            // update all subcategories
            const subCategories = await Categories.findAll({
                where: { parent_id: newCategory.id, },
                paranoid: false
            });
            if (subCategories.length > 0) {
                subCategories.forEach(async (subCategory) => {
                    await Categories.restore({ where: { id: subCategory.id } });
                });
            }

            // update productCategories table with new category to restore all categories
            const productCategories = await ProductCategories.findAll({
                where: { category_id: newCategory.id },
                paranoid: false
            });
            if (productCategories.length > 0) {
                productCategories.forEach(async (productCategory) => {
                    await ProductCategories.restore({ where: { id: productCategory.id } });
                });
            }
        }

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
        }
        if (isNaN(parent_id)) return APIResponseFormat._ResMissingRequiredField(res, "parent_id must be a number")

        if (parent_id === "0") {
            parent_id = null;
        } else {
            const parentCategory = await Categories.findOne({ where: { id: parent_id } });
            if (!parentCategory) return APIResponseFormat._ResDataNotExists(res, "Parent category not found");
        }
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
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

// delete category
const deleteCategory = async (req, res) => {
    try {
        let category_id = req.header('category_id');
        if (!category_id) return APIResponseFormat._ResMissingRequiredField(res, "category_id");

        // check if category_id is valid or not
        category_id = _doDecrypt(category_id);
        const existingCategory = await Categories.findOne({ where: { id: category_id } });
        if (!existingCategory) return APIResponseFormat._ResDataNotExists(res, "Category not found");


        // check if category has sub categories then delete them and also delete in  product_categories table

        const subCategories = await Categories.findAll({ where: { parent_id: category_id } });
        if (subCategories.length > 0) {
            // delete sub categories
            await Categories.destroy({ where: { parent_id: category_id } });
            // delete in product_categories table
            await db.product_categories.destroy({ where: { category_id: category_id } });
        }

        // delete category
        await Categories.destroy({ where: { id: category_id } });
        return APIResponseFormat._ResDataDeleted(res);
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

// active category
const activeCategory = async (req, res) => {
    try {
        let category_id = req.header('category_id');
        if (!category_id) return APIResponseFormat._ResMissingRequiredField(res, "category_id");

        // check if category_id is valid or not
        category_id = _doDecrypt(category_id);
        const existingCategory = await Categories.findOne({ where: { id: category_id } });
        if (!existingCategory) return APIResponseFormat._ResDataNotExists(res, "Category not found");

        // active category
        const activeCategory = await Categories.update({
            is_active: true
        },
            {
                where: {
                    id: category_id
                }
            });
        return APIResponseFormat._ResDataUpdated(res, activeCategory);
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

// inactive category
const inactiveCategory = async (req, res) => {
    try {
        let category_id = req.header('category_id');
        if (!category_id) return APIResponseFormat._ResMissingRequiredField(res, "category_id");

        // check if category_id is valid or not
        category_id = _doDecrypt(category_id);
        const existingCategory = await Categories.findOne({ where: { id: category_id } });
        if (!existingCategory) return APIResponseFormat._ResDataNotExists(res, "Category not found");

        // inactive category
        const inactiveCategory = await Categories.update({
            is_active: false
        }, {
            where: {
                id: category_id
            }
        });
        if (inactiveCategory) {
            return APIResponseFormat._ResDataUpdated(res, inactiveCategory);
        } else {
            return APIResponseFormat._ResDataNotExists(res, "Category not found");
        }
    } catch (err) {
        return APIResponseFormat._ResServerError(res, err);
    }
}

module.exports = {
    getAllCategories,
    updateCategory,
    addCategory,
    deleteCategory,
    activeCategory,
    inactiveCategory
};
