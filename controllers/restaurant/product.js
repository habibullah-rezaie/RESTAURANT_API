const { validationResult } = require("express-validator");

const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const ProductCategory = require("../../models/productCategory");
const Product = require("../../models/product");
const { sendValidatorError } = require("../../utils/error");
const { Op } = require("sequelize");

// GET / products/ => Get list of products
exports.getProducts = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const category = req.productCategory;
  const { limit, page, search, sortBy, sortDirection } = req.query;

  // Calculdate limit & page
  const LIMIT = limit ? limit : 10;
  const PAGE = page ? (page - 1) * LIMIT : page;

  let whereClause = true;

  if (category) whereClause = { ProductCategoryId: category.id };

  if (search)
    whereClause = {
      ...whereClause,
      [Op.or]: [
        {
          title: {
            [Op.and]: search.split(" ").map((str) => ({ [Op.substring]: str })),
          },
        },
        {
          description: {
            [Op.and]: search.split(" ").map((str) => ({ [Op.substring]: str })),
          },
        },
      ],
    };

  try {
    const products = await Product.findAndCountAll({
      where: whereClause,
      order: [
        [sortBy ? sortBy : "createdAt", sortDirection ? sortDirection : "DESC"],
      ],
      limit: LIMIT,
      offset: PAGE,
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

  // Calculdate limit & page
  const LIMIT = limit ? limit : 10;
  const PAGE = page ? (page - 1) * LIMIT : page;

  try {
    const count = await product.countToppings();
    const toppings = await product.getToppings({
      limit: LIMIT,
      offset: PAGE,
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

  // Calculdate limit & page
  const LIMIT = limit ? limit : 10;
  const PAGE = page ? (page - 1) * LIMIT : page;

  try {
    const allergen = await Allergen.findAndCountAll({
      where: {
        ProductId: product.id,
      },
      limit: LIMIT,
      offset: PAGE,
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

  // Calculdate limit & page
  const LIMIT = limit ? limit : 10;
  const PAGE = page ? (page - 1) * LIMIT : page;

  try {
    const additives = await Additive.findAndCountAll({
      where: {
        ProductId: product.id,
      },
      limit: LIMIT,
      offset: PAGE,
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

// GET /products/categories
const getCategories = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const LIMIT = req.query.limit > 0 ? req.query.limit : 24;
  const OFFSET = req.query.page > 0 ? (req.query.page - 1) * LIMIT : 0;

  try {
    const categories = await ProductCategory.findAndCountAll({
      limit: LIMIT,
      offset: OFFSET,
    });

    res.status(200).json({
      categories: categories.rows,
      count: categories.count,
      message: "Successfully fetched categories",
    });
  } catch (err) {
    next(err);
  }
};
exports.getCategories = getCategories;
