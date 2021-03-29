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
