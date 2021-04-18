const { unlink } = require("fs/promises");
const { join } = require("path");
const { validationResult } = require("express-validator");

const rootDir = require("../../utils/path");
const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");
const { sendValidatorError, throwError } = require("../../utils/error");

// Handle product deletion
exports.deleteProduct = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  try {
    const product = req.product;

    const files = await product.getFiles();

    if (files.length > 0) {
      for (const file of files) {
        // TODO: this should be edited if change the database structure.
        await unlink(join(rootDir, "files", file.fileName));
        await product.removeFile(file);
        await file.destroy();
      }
    }

    const allergens = await Allergen.findAll({
      where: {
        ProductId: product.id,
      },
    });

    for (const allergen of allergens) {
      await allergen.destroy();
    }

    const additives = await Additive.findAll({
      where: {
        ProductId: product.id,
      },
    });

    for (const additive of additives) {
      await additive.destroy();
    }

    const toppings = await product.getToppings();

    if (toppings.length > 0) {
      // TODO: this should be edited if change the database structure.
      await product.removeToppings(toppings);
    }

    await product.destroy();

    res.status(200).json({
      message: "Deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};

// Handle DELETE /admin/products/:productId/files
exports.deleteProductFile = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const product = req.product;
  const file = req.file;
  try {
    await product.removeFile(file);
    await file.destroy();

    res.status(200).json({
      message: "Successfully deleted file.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteProductAllergen = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { product, allergen } = req;

  try {
    if (allergen) {
      await allergen.destroy();

      return res.json({
        message: "Allergen Deleted sucessfully",
      });
    }
    await Allergen.destroy({
      where: {
        ProductId: product.id,
      },
    });

    return res.status(200).json({
      message: "Deleted all allergens for the product.",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Handle DELETE /admin/products/:productId/additives => delete
// on or all additives of a perticular product
exports.deleteProductAdditive = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { product, additive } = req;

  try {
    if (additive) {
      await additive.destroy();

      return res.json({
        message: "Additive Deleted sucessfully",
      });
    }
    await Additive.destroy({
      where: {
        ProductId: product.id,
      },
    });

    return res.status(200).json({
      message: "Deleted all additives for the product.",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteProductTopping = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { product, topping } = req;
  const { force } = req.body;

  try {
    if (topping) {
      await product.removeTopping(topping);

      await topping.destroy();

      return res.json({
        message: "Topping deleted sucessfully",
      });
    }

    const toppings = await product.getToppings();

    // If toppings list has some items
    if (toppings.length > 0) {
      // If force option is given, delete all toppings
      if (force) {
        await product.removeToppings(toppings);
        for (const tp of toppings) {
          await tp.destroy();
        }

        return res.status(200).json({
          message: "Deleted all toppings of the product.",
        });
      }
    }

    // Toppings is empty, and force option given
    return res.status(400).json({
      message: "Product deos not have any toppings to delete.",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// DELETE /admin/products/categories => Delete a category
exports.deleteProductCategory = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  // Stored category during validations in validators
  const { category } = req;
  const { force } = req.body;
  try {
    // Find all products in the category
    const products = await Product.findAll({
      where: {
        ProductCategoryId: category.id,
      },
    });

    // Does category contain any product?
    // If so, delete it only if the force option is given.
    if (products.length > 0) {
      if (force) {
        for (const product of products) {
          await deleteProduct(product);
        }
      } else {
        return res.status(400).json({
          message:
            'Could not delete the category because it is not empty. Use "force" ' +
            "option to delete all containing products.",
        });
      }
    }

    await category.destroy();

    res.status(200).json({
      message: "Successfully deleted the product category",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
