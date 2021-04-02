const { validationResult } = require("express-validator");

const Product = require("../../models/product");
const { sendValidatorError } = require("../../utils/error");

// GET / products/ => Get list of products
exports.getProducts = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const category = req.productCategory;
  const { limit, page } = req.query;
  try {
    const products = await Product.findAll({
      where: {
        ProductCategoryId: category.id,
      },
      limit: limit ? limit : 10,
      offset: page ? (page - 1) * limit : page,
    });

    res.status(200).json({
      message: "Successfully fetched products.",
      products: products,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET / products/:id => Get detail of one product
exports.getProduct = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;

  res.status(200).json({
    message: "Successfully fetched product",
    product: {
      id: product.id,
      title: product.title,
      description: product.description,
      inPrice: product.inPrice,
      outPrice: product.outPrice,
      discount: product.discount,
      createdAt: product.createdAt,
      productCategory: product.ProductCategory,
    },
  });
};

// GET / products/toppings => Get get toppings of a single product
exports.getToppings = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;

  try {
    const toppings = await product.getToppings();

    res.status(200).json({
      toppings: toppings,
      message: "Successfully fetched",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET / products/allergens => Get Allergens of a single product
exports.getAllergens = async (req, res, next) => {};

// GET / products/additives => Get Additives of a single product
exports.getAdditives = async (req, res, next) => {};

// GET / products/files => Get Files of a single product
exports.getFiles = async (req, res, next) => {};
