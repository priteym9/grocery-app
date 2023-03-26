const db = require("../../db/models/index");
const { sendSuccess, sendError } = require("../../utils/sendResponse");

const Category = db.categories;
const Product = db.products;
const ProductCategory = db.product_categories;
const CryptoJS = require("crypto-js");
const fs = require("fs");

// make a function to save the file in public/products folder and get the file name
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, false, "Image is required");
    } else {
      // read the file from req.file and save it in public/products folder and get the file name using readFileSync
      // and save the file name in images column of product table

      let filedata = fs.readFileSync(req.file.path);
      return sendSuccess(res, 200, true, "Image uploaded successfully", { file: req.file, filedata: filedata });

    }
  } catch (error) {
    return sendError(res, 500, false, "Something went wrong", error);
  }
};

// add product
const addProduct = async (req, res) => {
  try {
    let { title, amount, discount_type, discount_amount, short_description, description, categoryArray } = req.body;
    // check if all fields are filled
    if (!title || !amount || !discount_type || !discount_amount || !short_description || !description) {
      return sendError(res, 400, false, "All fields are required");
    }

    // check categoryArray is not empty
    if (!categoryArray || categoryArray.length === 0) {
      return sendError(res, 400, false, "Category is required");
    }

    // check if product already exists
    const product = await Product.findOne({ where: { title } });
    if (product) {
      return sendError(res, 400, false, "Product already exists");
    }

    // create a product and insert data into it and also insert category_id in product_category table 
    const newProduct = await Product.create({
      title,
      amount,
      discount_type,
      discount_amount,
      short_description,
      description,
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
        return sendSuccess(res, 200, true, "Product added successfully", newProduct);
      }
    }
  } catch (error) {
    return sendError(res, 500, false, "Something went wrong", error);
  }
};

// get product by id
const getProductById = async (req, res) => {
  // Get Product details by Product Id
  if (!req.header("product_id")) {
    return sendError(res, 400, false, "Product Id is required");
  }
  try {
    const product = await Product.findOne({
      where: {
        id: CryptoJS.AES.decrypt(
          req.header("product_id"),
          process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8),
      },
    });
    if (product) {
      return sendSuccess(
        res,
        200,
        true,
        "Product fetched successfully",
        product
      );
    } else {
      return sendError(res, 200, false, "Product not found");
    }
  } catch (error) {
    return sendError(res, 500, false, "som", error);
  }
};

// Get All Products by Category Id
const getProductByCategory = async (req, res) => {
  try {
    if (!req.header("category_id")) {
      return sendError(res, 400, false, "Category Id is required");
    }

    // check category id is valid or not
    const category = await Category.findOne({
      where: {
        id: CryptoJS.AES.decrypt(
          req.header("category_id"),
          process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8),
      },
    });
    if (category) {
      const products = await ProductCategory.findAll({
        where: {
          category_id: CryptoJS.AES.decrypt(
            req.header("category_id"),
            process.env.SECRET_KEY
          ).toString(CryptoJS.enc.Utf8),
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
        return sendSuccess(
          res,
          200,
          true,
          "Products fetched successfully",
          products
        );
      } else {
        return sendError(res, 200, false, "this category has no products");
      }
    } else {
      return sendError(res, 200, false, "Category not found");
    }

    // Get All Products by Category Id join with product_categories table
  } catch (error) {
    return sendError(res, 500, false, "Something went wrong", error);
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

    let product_id = CryptoJS.AES.decrypt(
      req.header("product_id"),
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    // check if all fields are empty or not
    if (!title || !amount || !discount_type || !discount_amount || !short_description || !description) {
      return sendError(res, 400, false, "All fields are required");
    }

    // check if categoryArray is empty or not
    if (!categoryArray || categoryArray.length === 0) {
      return sendError(res, 400, false, "Category is required");
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
        return sendSuccess(res, 200, true, "Product updated successfully", { previousCategoryArray, currentCategoryArray, insertCategoryArray, deleteCategoryArray });
      }
    } else {
      return sendError(res, 200, false, "Product not found");
    }
  } catch (error) {
    return sendError(res, 500, false, "Something went wrong", error);
  }
};

module.exports = {
  getProductById,
  getProductByCategory,
  updateProduct,
  addProduct,
  uploadImage
};


