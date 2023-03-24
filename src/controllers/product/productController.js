const db = require("../../db/models/index");
const { sendSuccess, sendError } = require("../../utils/sendResponse");

const Category = db.categories;
const Product = db.products;
const ProductCategory = db.product_categories;
const CryptoJS = require("crypto-js");

// add product
const addProduct = async (req, res) => {
  let {
    title,
    amount,
    discount_type,
    discount_amount,
    avatar_image,
    images,
    short_description,
    description,
  } = req.body;

  // generate slug from title and insert it into product table
  const slug = title.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')


  let category_id = CryptoJS.AES.decrypt(
    req.header("category_id"),
    process.env.SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  try {
    // for loop for checking all fields are not empty
    for (let key in req.body) {
      if (req.body[key] === "")
        return sendError(res, 400, false, `${key} is required`);
    }
    // check if category_id is a number
    if (isNaN(category_id))
      return sendError(res, 400, false, "Category Id must be a number");

    // check if category exists
    const category = await Category.findOne({ where: { id: category_id } });
    if (!category)
      return sendError(res, 400, false, "Category does not exist");

    // check if product already exists
    const product = await Product.findOne({ where: { title } });
    if (product)
      return sendError(res, 400, false, "Product already exists");

    //  crearte product and insert data into it and also insert category_id in product_category table
    const newProduct = await Product.create({
      title,
      amount,
      discount_type,
      discount_amount,
      avatar_image,
      images,
      short_description,
      description,
      category_id,
      slug
    });
    if (newProduct) {
      // insert inserted product's id and  category_id in product_category table
      const productCategory = await ProductCategory.create({
        product_id: newProduct.id,
        category_id,
      });
      if (productCategory)
        return sendSuccess(
          res,
          201,
          true,
          "Product created successfully",
          newProduct
        );
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
    console.log(category);
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
  let {
    title,
    amount,
    discount_type,
    discount_amount,
    avatar_image,
    images,
    short_description,
    description,
  } = req.body;
  let category_id = CryptoJS.AES.decrypt(
    req.header("category_id"),
    process.env.SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  let product_id = CryptoJS.AES.decrypt(
    req.header("product_id"),
    process.env.SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  try {
    // for loop for checking all fields are not empty
    for (let key in req.body) {
      if (req.body[key] === "")
        return sendError(res, 400, false, `${key} is required`);
    }
    // check if category_id is a number
    if (isNaN(category_id))
      return sendError(res, 400, false, "Category Id must be a number");

    // check if product_id is a number
    if (isNaN(product_id))
      return sendError(res, 400, false, "Product Id must be a number");

    // check if category exists
    const category = await Category.findOne({ where: { id: category_id } });
    if (!category)
      return sendError(res, 400, false, "Category does not exist");

    // check if product already exists
    const product = await Product.findOne({ where: { id: product_id } });
    if (!product)
      return sendError(res, 400, false, "Product does not exist");

    // update product
    const updatedProduct = await Product.update(
      {
        title,
        amount,
        discount_type,
        discount_amount,
        avatar_image,
        images,
        short_description,
        description,
        category_id,
      },
      { where: { id: product_id } }
    );
    if (updatedProduct) {
      // update category_id in product_category table
      const productCategory = await ProductCategory.update(
        { category_id },
        { where: { product_id } }
      );
      if (productCategory)
        return sendSuccess(
          res,
          200,
          true,
          "Product updated successfully",
          updatedProduct
        );
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
};
