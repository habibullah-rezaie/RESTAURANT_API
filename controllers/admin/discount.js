const { validationResult } = require("express-validator");

const { sendValidatorError } = require("../../utils/error");
const Product = require("../../models/product");

exports.discountAll = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { discount } = req.body;

  try {
    const products = await Product.findAll();

    if (products.length > 0) {
      for (const product of products) {
        product.discount = discount;
        await product.save();
      }

      return res.status(200).json({
        message: `Gave ${discount}% discount to every product.`,
      });
    }

    res.status(400).json({
      message: "No product exists.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
