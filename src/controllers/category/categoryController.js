const db = require('../../db/models/index');
const CryptoJS = require('crypto-js');
const Categories = db.categories;

const categoryPage = (req, res) => {
    res.send("category page")
}

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
const addCategory = (req, res) => {
    res.send("add category")
}

// update category
const updateCategory = async (req, res) => {
   try{ 
    const update_id = req.header('id');
    const id = CryptoJS.AES.decrypt(update_id, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
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
    categoryPage,
    getAllCategories,
    updateCategory,
    addCategory
}