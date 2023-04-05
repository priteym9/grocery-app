const db = require("../../db/models/index");
const { _doDecrypt } = require("../../utils/encryption");
const APIResponseFormat = require("../../utils/APIResponseFormat");
const Category = db.categories;
const Product = db.products;
const ProductCategory = db.product_categories;
const fs = require("fs");

// make a function to save the file in public/products folder and get the file name
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return APIResponseFormat._ResMissingRequiredField(res, "Image");
    }
    let filedata = fs.readFileSync(req.file.path);
    req.file.data = filedata;
    return APIResponseFormat._ResDataCreated(res, { file: req.file });
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

// make an API for upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files) {
      return APIResponseFormat._ResMissingRequiredField(res, "Image");
    }
    return APIResponseFormat._ResDataCreated(res, { files: req.files });
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

// add product
const addProduct = async (req, res) => {
  try {
    let { title, amount, discount_type, discount_amount, short_description, description, categoryArrayFromBody } = req.body;
    // check if all fields are filled
    if (!title || !amount || !discount_type || !discount_amount || !short_description || !description || !categoryArrayFromBody) {
      return APIResponseFormat._ResMissingRequiredField(res, "All fields");
    }

    let categoryArray = JSON.parse(categoryArrayFromBody);

    // check categoryArray is not empty
    if (!categoryArray || categoryArray.length === 0) {
      return APIResponseFormat._ResMissingRequiredField(res, "Category");
    }

    // check if image is uploaded or not    
    if (!req.file) {
      return APIResponseFormat._ResMissingRequiredField(res, "Image");
    }
    let avatar_image = req.file.filename;

    // check if product already exists
    const product = await Product.findOne({ where: { title } });
    if (product) {
      return APIResponseFormat._ResDataAlreadyExists(res)
    }

    // create a product and insert data into it and also insert category_id in product_category table 
    const newProduct = await Product.create({
      title,
      amount,
      discount_type,
      discount_amount,
      short_description,
      description,
      avatar_image,
      slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    });
    if (newProduct) {
      // append produt_id in productCategoryArray
      const productCategoryArray = [];
      categoryArray.forEach((item) => {
        productCategoryArray.push({ product_id: newProduct.id, category_id: item })
      });
      // insert data into product_category table
      const productCategory = await ProductCategory.bulkCreate(productCategoryArray);
      if (productCategory) {
        return APIResponseFormat._ResDataCreated(res, newProduct);
      }
    }
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

// get product by id
const getProductById = async (req, res) => {
  // Get Product details by Product Id
  if (!req.header("product_id")) {
    return APIResponseFormat._ResMissingRequiredField(res, "Product Id");
  }
  try {
    const product = await Product.findOne({
      where: {
        id: _doDecrypt(req.header("product_id")),
      },
    });
    if (product) {
      return APIResponseFormat._ResDataFound(res, product);
    } else {
      return APIResponseFormat._ResDataNotFound(res);
    }
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

// Get All Products by Category Id
const getProductByCategory = async (req, res) => {
  try {
    if (!req.header("category_id")) {
      return APIResponseFormat._ResMissingRequiredField(res, "Category Id");
    }

    // check category id is valid or not
    const category = await Category.findOne({
      where: {
        id: _doDecrypt(req.header("category_id")),
      },
    });
    if (category) {
      const products = await ProductCategory.findAll({
        where: {
          category_id: _doDecrypt(req.header("category_id")),
        },
        attributes: ["id", "product_id", "category_id"],
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });

      // check if products array is not empty
      if (products.length > 0) {
        return APIResponseFormat._ResDataFound(res, products);
      } else {
        return APIResponseFormat._ResDataNotExists(res, "No products found")
      }
    } else {
      return APIResponseFormat._ResDataNotExists(res, "No category found")
    }

    // Get All Products by Category Id join with product_categories table
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

// update product
const updateProduct = async (req, res) => {
  try {
    let {
      title,
      amount,
      discount_type,
      discount_amount,
      short_description,
      description,
      categoryArray,
    } = req.body;
    let product_id = _doDecrypt(req.header("product_id"));

    // check if product id is valid or not
    if (!product_id) {
      return APIResponseFormat._ResMissingRequiredField(res, "Product Id");
    }

    // check if all fields are empty or not
    if (!title || !amount || !discount_type || !discount_amount || !short_description || !description || !categoryArray) {
      return APIResponseFormat._ResMissingRequiredField(res, "All fields");
    }

    // check if categoryArray is empty or not
    if (!categoryArray || categoryArray.length === 0) {
      return APIResponseFormat._ResMissingRequiredField(res, "Category");
    }

    // check product id is valid or not, if valid then update product details and also update product_category table 
    const product = await Product.findOne({ where: { id: product_id } });
    if (product) {
      const updatedProduct = await Product.update(
        {
          title,
          amount,
          discount_type,
          discount_amount,
          short_description,
          description,
          slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, ""),
        },
        { where: { id: product_id } }
      );
      if (updatedProduct) {
        // if current category array is [1, 2, 4] and previous category array is [1, 2, 3] then it will delete 3 from product_category table and insert 4 into product_category table
        let product_id = product.id;
        let previousCategoryArray = [];
        let currentCategoryArray = [];

        // get all previous category id from product_category table
        const previousCategory = await ProductCategory.findAll({
          where: { product_id },
        });
        if (previousCategory.length > 0) {
          previousCategory.forEach((item) => {
            previousCategoryArray.push(item.category_id);
          });
        }

        // get all current category id from categoryArray
        categoryArray.forEach((item) => {
          currentCategoryArray.push(item);
        });

        // get all category id which are not in previous category array
        let insertCategoryArray = currentCategoryArray.filter(
          (item) => !previousCategoryArray.includes(item)
        );

        // get all category id which are not in current category array
        let deleteCategoryArray = previousCategoryArray.filter(
          (item) => !currentCategoryArray.includes(item)
        );

        // delete category id from product_category table using bulk delete
        if (deleteCategoryArray.length > 0) {
          await ProductCategory.destroy({
            where: { product_id, category_id: deleteCategoryArray },
            force: true,
          });
        }

        // insert new category id into product_category table
        if (insertCategoryArray.length > 0) {
          let insertArray = [];
          insertCategoryArray.forEach((item) => {
            insertArray.push({ product_id, category_id: item, });
          });
          await ProductCategory.bulkCreate(insertArray);
        }
        return APIResponseFormat._ResDataUpdated(res, "Product updated successfully", { previousCategoryArray, currentCategoryArray, insertCategoryArray, deleteCategoryArray });
      }
    } else {
      return APIResponseFormat._ResDataNotExists(res, "Product not found");
    }
  } catch (error) {
    return APIResponseFormat._ResServerError(res, error);
  }
};

const getAllProducts = async (req , res) => {
  try{
    const products = await Product.findAll();
    if(products.length > 0){
      return APIResponseFormat._ResDataFound(res, products);
    }else{
      return APIResponseFormat._ResDataNotFound(res);
    }

  }catch(error){
    return APIResponseFormat._ResServerError(res, error);
  }
}

module.exports = {
  getProductById,
  getProductByCategory,
  updateProduct,
  addProduct,
  uploadImage,
  uploadMultipleImages,
  getAllProducts
};