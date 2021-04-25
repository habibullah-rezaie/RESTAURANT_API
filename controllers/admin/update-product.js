const { validationResult } = require("express-validator");

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

  const allergen = req.allergen;
  const { text, productId } = req.body;

  try {
    if (text) allergen.text = text;

    if (productId) allergen.ProductId = productId;
    await allergen.save();

    // Successful response
    return res.status(200).json({
      allergen: allergen,
      message: "Successfully changed the allergen",
    });
  } catch (err) {
    // Internal server error
    console.error(err);
    next(err);
  }
};

// PUT /admin/products/additives/:id change additives
exports.updateProductAdditive = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const additive = req.additive;
  const { text, productId } = req.body;

  try {
    if (text) additive.text = text;

    if (productId) additive.ProductId = productId;
    await additive.save();

    // Successful response
    return res.status(200).json({
      additive: additive,
      message: "Successfully changed the allergen",
    });
  } catch (err) {
    // Internal server error
    console.error(err);
    next(err);
  }
};

// PUT /admin/products/toppings/:id change toppings
exports.updateProductToppings = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);
  const { title, price } = req.body;

  const topping = req.topping;

  try {
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

  try {
    const category = req.category;

    category.name = name ? name : category.name;
    category.description = description ? description : category.description;

    await category.save();

    res.status(200).json({
      category: category,
      message: "Successfully updated category.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
