const { validationResult } = require("express-validator");

const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");
const { sendValidatorError } = require("../../utils/error");

exports.updateProduct = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);
  const { name, description, inPrice, outPrice, discount, category } = req.body;

  const product = req.product;

  if (name) {
    product.title = name;
  }

  if (description) {
    product.description = description;
  }

  if (inPrice) product.inPrice = inPrice;

  if (outPrice) product.outPrice = outPrice;

  if (discount) product.discount = discount;

  if (category && req.category) {
    product.ProductCategoryId = req.category.id;
  }

  try {
    await product.save();

    res.json({
      message: "Successfully updated product",
      product: product,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// PUT /admin/products/allergens/:id change allergen
exports.updateProductAllergen = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { text, productId } = req.body;

  try {
    if (text || productId) {
      const allergen = await Allergen.findByPk(allergenId);
      if (allergen) {
        if (text) allergen.text = text;
        if (productId) allergen.ProductId = productId;
        await allergen.save();

        // Successful response
        return res.status(200).json({
          allergen: allergen,
          message: "Successfully changed the allergen",
        });
      }

      // Invalid Id no allergen found
      return res
        .status(422)
        .json({ message: "Allergen not found, invalid id" });
    }

    // No text provided
    return res.status(422).json({ message: "No text or product id provided." });
  } catch (err) {
    // Internal server error
    console.error(err);
    err.statusCode = err.statusCode ? err.statusCode : 500;
    next(err);
  }
};

// PUT /admin/products/additives/:id change additives
exports.updateProductAdditive = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { text, productId } = req.body;

  try {
    if (text || productId) {
      const additive = await Additive.findByPk(additiveId);
      if (additive) {
        if (text) additive.text = text;
        if (productId) additive.ProductId = productId;
        await additive.save();

        // Successful response
        return res.status(200).json({
          additive: additive,
          message: "Successfully changed the additive.",
        });
      }

      // Invalid Id no additive found
      return res
        .status(422)
        .json({ message: "Additive not found, invalid id" });
    }

    // No text provided
    return res.status(422).json({ message: "No text or product id provided." });
  } catch (err) {
    // Internal server error
    console.error(err);
    err.statusCode = err.statusCode ? err.statusCode : 500;
    next(err);
  }
};

// PUT /admin/products/toppings/:id change toppings
exports.updateProductToppings = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);
  const { title, price } = req.body;

  try {
    if (!(title || price)) {
      // No text provided
      return res.status(422).json({ message: "No text or price provided." });
    }

    const topping = await Topping.findByPk(toppingId);

    // Invalid Id no topping found
    if (!topping) {
      return res.status(422).json({ message: "topping not found, invalid id" });
    }

    if (title) topping.title = title;

    if (price) topping.price = price;

    await topping.save();

    // Successful response
    return res.status(200).json({
      topping: topping,
      message: "Successfully changed the topping.",
    });
  } catch (err) {
    // Internal server error
    console.error(err);
    err.statusCode = err.statusCode ? err.statusCode : 500;
    next(err);
  }
};

/**
 * PUT /admin/products/categories/:id => change a catelgories properties
 */
exports.updateProductCategory = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(422).json({
      message: "Not title nor description provided",
    });
  }

  try {
    const ctg = await ProductCategory.findByPk(ctgId);

    if (!ctg)
      return res.status(422).json({
        message: "Invalid category id",
      });

    ctg.name = name ? name : ctg.name;
    ctg.description = description ? description : ctg.description;

    await ctg.save();

    res.status(200).json({
      category: ctg,
      message: "Successfully updated category.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
