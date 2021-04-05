const { validationResult } = require("express-validator");
const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");

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
    const products = await Product.findAndCountAll({
      where: category
        ? {
            ProductCategoryId: category.id,
          }
        : true,
      limit: limit ? limit : 10,
      offset: page ? (page - 1) * limit : page,
    });

    res.status(200).json({
      message: "Successfully fetched products.",
      products: products.rows,
      count: products.count,
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
  const { limit, page } = req.query;

  try {
    const count = await product.countToppings();
    const toppings = await product.getToppings({
      limit: limit ? limit : 10,
      offset: page ? (page - 1) * limit : page,
    });

    res.status(200).json({
      toppings: toppings,
      count: count,
      message: "Successfully fetched",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET / products/allergens => Get Allergens of a single product
exports.getAllergens = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;
  const { limit, page } = req.query;

  try {
    const allergen = await Allergen.findAndCountAll({
      where: {
        ProductId: product.id,
      },
      limit: limit ? limit : 10,
      offset: page ? (page - 1) * limit : page,
    });

    res.status(200).json({
      allergen: allergen.rows,
      count: allergen.count,
      message: "Successfully fetched",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET / products/additives => Get Additives of a single product
exports.getAdditives = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;
  const { limit, page } = req.query;

  try {
    const additives = await Additive.findAndCountAll({
      where: {
        ProductId: product.id,
      },
      limit: limit ? limit : 10,
      offset: page ? (page - 1) * limit : page,
    });

    res.status(200).json({
      additives: additives.rows,
      count: additives.count,
      message: "Successfully fetched",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET / products/files => Get Files of a single product
exports.getFiles = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;

  try {
    const files = await product.getFiles();

    res.status(200).json({
      files: files,
      message: "Successfully fetched",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
