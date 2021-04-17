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
exports.deleteProductAdditive = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await Additive.findByPk(id);
    console.log(prod);
    if (!prod) {
      return res.status(422).json({
        Message: "Invalid Additive",
      });
    }
    console.log(prod);
    const deleteAdditive = await Additive.destroy({
      where: {
        id: id,
      },
    });
    if (!deleteAdditive) {
      return res.status(500).json({
        message: "Couldn`t delete Additive contact to 119",
      });
    }
    return res.json({
      message: "Additive  Deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteProductTopping = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await Topping.findByPk(id);
    console.log(prod);
    if (!prod) {
      return res.status(422).json({
        Message: "Invalid Topping",
      });
    }
    console.log(prod);
    const deleteTopping = await Topping.destroy({
      where: {
        id: id,
      },
    });
    if (!deleteTopping) {
      return res.status(500).json({
        message: "Couldn`t delete Topping contact to 119",
      });
    }
    return res.json({
      message: "Topping deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteProductCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await ProductCategory.findByPk(id);
    console.log(prod);
    if (!prod) {
      return res.status(422).json({
        Message: "Invalid Category",
      });
    }
    console.log(prod);
    const deleteTopping = await ProductCategory.destroy({
      where: {
        id: id,
      },
    });
    if (!deleteTopping) {
      return res.status(500).json({
        message: "Couldn`t delete Category contact to 119",
      });
    }
    return res.json({
      message: "Category deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};
