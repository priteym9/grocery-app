const db = require('../../db/models/index');
const CryptoJS = require('crypto-js');
const Categories = db.categories;

// get all categories
const getAllCategories = async (req, res) => {
    try{
        const allCategories = await Categories.findAll({
            attributes : ['id', 'title', 'parent_id']
        });
        if(allCategories.length === 0){
            return res.status(200).json({
                success : true,
                message : "No categories found",
                result : allCategories
            });
        }else{
            return res.status(200).json({
                success : true,
                message : "All categories",
                result : allCategories
            });
        }

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            result : err
        });
    }
}


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
            const parentCategory = await Categories.findOne({ where: { id: parent_id } });
            if (!parentCategory) return res.status(400).json({ success: false, message: "Parent category does not exist" });
        }

        // check if category already exists
        const category = await Categories.findOne({ where: { title } });
        if (category) return res.status(400).json({ success: false, message: "Category already exists" });

        // create category
        const newCategory = await Categories.create({ title, parent_id });
        return res.status(201).json({ success: true, message: "Category created successfully", result: newCategory });

    } catch (error) {
        return res.status(500).json({ success: true, message: "Internal server error", error: error.message });
    }
};


// update category
const updateCategory = async (req, res) => {
   try{ 
    const id = CryptoJS.AES.decrypt(req.header('id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const { title, parent_id} = req.body;

    if(!id || !title || !parent_id){
        return res.status(400).send("All fields are required");
    }else{  
        const findCategory = await Categories.findOne({
            where : {
                id : id
            }
        });

        if(!findCategory){
            return res.status(400).json({
                success : false,
                message : "Category does not exists",
                result : findCategory
            })
        }else{
            const updateCategory = await Categories.update({
                title,
                parent_id
            },{
                where : {
                    id : id
                }
            });
            return res.status(200).json({
                success : true,
                message : "Category updated successfully",
                result : updateCategory
            });
        }
    }
   }catch(err){
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            result : err
        });
   }
}

module.exports = {
    getAllCategories,
    updateCategory,
    addCategory,
};
