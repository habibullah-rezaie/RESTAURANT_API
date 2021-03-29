const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");

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
