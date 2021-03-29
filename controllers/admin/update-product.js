const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;

  const { name, description, inPrice, outPrice, discount, category } = req.body;

  try {
    const product = await Product.findOne({ where: { id: productId } });
    if (name) {
      product.title = name;
    }

    if (description) {
      product.description = description;
    }

    if (inPrice) product.inPrice = inPrice;

    if (outPrice) product.outPrice = outPrice;

    if (discount) product.discount = discount;

    const newCtg = await ProductCategory.findOne({ where: { name: category } });
    console.log(newCtg);
    if (category && newCtg) {
      product.ProductCategoryId = newCtg.id;
    }

    await product.save();
    res.send("hi");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// PUT /admin/products/allergens/:id change allergen
exports.updateProductAllergen = async (req, res, next) => {
  const allergenId = req.params.id;

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
  const additiveId = req.params.id;

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
  const toppingId = req.params.id;

  const { title, price } = req.body;

  try {
    if (!(title || price)) {
      // No text provided
      return res
        .status(422)
        .json({ message: "No text or product id provided." });
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
