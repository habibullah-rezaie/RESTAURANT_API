const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");
const File = require("../../models/file");
const { validationResult } = require("express-validator");
const { sendValidatorError, throwError } = require("../../utils/error");

// POST /admin/products/
exports.addProduct = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { name, description, inPrice, outPrice, discount } = req.body;
  const category = req.productCategory;

  try {
    const newProduct = await Product.create({
      title: name,
      description,
      inPrice,
      outPrice,
      discount,
    });

    if (!newProduct)
      throwError("Something went wrong when creating product", 500);

    const fetchedRes = await newProduct.setProductCategory(category.id);

    if (!fetchedRes)
      throwError("Failed to add product to category " + category);

    res.status(201).json({
      product: newProduct,
      message: "Successfully created a product.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// handle POST /admin/products/allergens, and create allergens
exports.addAllergrns = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { allergens } = req.body;
  const { product } = req; // Fetched product during

  try {
    const newAllergens = []; // Create allergens to sendS

    let warning = ""; // warning

    // Loop through the allergens and create them.
    for (const text of allergens) {
      // validate for type, and length
      if (!text || typeof text !== "string" || text.length > 255) {
        warning =
          "Some invalid allergen (invalid type, or length or empty string) included, skipped them.";
        continue;
      }

      const newAllergen = await Allergen.create({
        text: text,
      });

      if (!newAllergen) throwError("Failed to create allergens; Sorry!");
      await newAllergen.setProduct(product.id);

      newAllergens.push(newAllergen);
    }

    res.status(201).json({
      allergens: newAllergens,
      message: "Allergen sucessfully created allergen",
      warnings,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// handle POST /admin/products/additives, and create additives
exports.addAdditives = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { additives } = req.body;
  const { product } = req; // Fetched product during

  try {
    const newAdditives = []; // Create additives to sendS
    let warning = "";
    // Loop through the additives and create them.
    for (const text of additives) {
      // validate for type, and length
      if (!text || typeof text !== "string" || text.length > 255) {
        warning =
          "Some invalid additives (invalid type, or length or empty string) included, skipped them.";
        continue;
      }

      try {
        const newAdditive = await Additive.create({
          text: text,
        });

        if (!newAdditive) throwError("Failed to create additives; Sorry!");
        await newAdditive.setProduct(product.id);

        newAdditives.push(newAdditive);
      } catch (err) {
        console.error(err);
        next(err);
      }
    }

    res.status(201).json({
      additives: newAdditives,
      message: "Additives sucessfully created additive",
      warnings: warning,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addToppings = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { toppings } = req.body;
  const { product } = req; // Fetched product during

  try {
    const newToppings = []; // Created toppings to send
    let warnings = ""; // Warnings to send

    // Loop through the Toppings and create them.
    for (const topping of toppings) {
      if (topping.price !== undefined && topping.title) {
        const newTopping = await Topping.create({
          price: topping.price,
          title: topping.title,
        });

        if (!newTopping) throwError("Failed to create Toppings; Sorry!");
        await newTopping.addProducts(product.id);

        newToppings.push(newTopping);
      } else {
        warnings =
          "Some array elements didn't had both price and title, so skipped them.";
      }
    }

    res.status(201).json({
      Toppings: newToppings,
      message: "Toppings sucessfully created additive",
      warnings,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addFile = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const file = req.file;

  try {
    if (!file) throwError("No file sent with request; Aborting!", 422);

    const product = req.product;

    const newFile = await File.create({
      fileName: file.filename,
    });

    const fetchedFile = product.addFiles(newFile);

    if (!fetchedFile) throwError("Cannot add file for the product, weired.");
    const count = await product.countFiles();
    return res.status(201).json({
      count,
      file: file.path,
      message: "sucessfully added files",
    });
  } catch (err) {
    console.log(err);
  }
};

// handle /admin/products/categories and create a new category
exports.addProductCategory = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { name, description } = req.body;

  try {
    const newCategory = await ProductCategory.create({
      name,
      description,
    });

    if (!newCategory)
      throwError("Can't create category, may be it previously exists");

    res.status(201).json({
      category: newCategory,
      message: "Create category successfully.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
