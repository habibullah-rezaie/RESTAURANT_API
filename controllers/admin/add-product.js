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

exports.addAllergrns = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { allergens } = req.body;
  const { product } = req;  // Fetched product during

  try {
    const newAllergens = [];

    // Loop through the allergens and create them.
    for (const text of allergens) {
      if (text) {
        try {
          const newAllergen = await Allergen.create({
            text: text,
          });

          if (!newAllergen) throwError("Failed to create allergens; Sorry!");
          await newAllergen.setProduct(product.id);

          newAllergens.push(newAllergen);
        } catch (err) {
          console.error(err);
          next(err);
        }
      }
    }

    res.status(201).json({
      allergens: newAllergens,
      message: "Allergen sucessfully created allergen",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addAdditives = async (req, res, next) => {
  const { additives, productId } = req.body;
  try {
    const prod = await Product.findByPk(productId);
    if (!prod) {
      res.status(422).json({
        message: "Invalid Product Id",
      });
    }
    additives.forEach(async (texts) => {
      const newAdditives = await Additive.create({
        text: texts,
      });
      await newAdditives.setProduct(prod);
      res.status(201).json({
        product: req.body,
        message: "sucesssfully added additives",
      });
    });
  } catch (err) {
    console.log(err);
  }
};
exports.addToppings = async (req, res, next) => {
  const { toppings, productId } = req.body;
  try {
    const prod = await Product.findByPk(productId);
    if (!prod) {
      return res.status(422).json({
        message: "Invalid Product Id",
      });
    }
    console.log(toppings);
    toppings.forEach(async (texts) => {
      const title = texts.title;
      const price = texts.price;
      const newToppings = await Topping.create({
        title: title,
        price: price,
      });
      console.log(newToppings);
      await newToppings.setProducts(prod);
      return res.status(201).json({
        products: req.body,
        message: "sucessfully topping added",
      });
    });
  } catch (err) {
    console.log(err);
  }
};
exports.addProductCategory = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const newCategory = await ProductCategory.create({
      name: title,
      description: description,
    });
    res.status(201).json({
      product: req.body,
      message: "Sucessfully added category",
    });

    console.log(newCategory);
  } catch (err) {
    console.log(err);
  }
};
exports.addFile = async (req, res, next) => {
  const { productId } = req.body;
  const files = req.files;
  console.log(files);
  try {
    const prod = await Product.findByPk(productId);
    if (!prod) {
      return res.status(422).json({
        message: "Invalid Product Id",
      });
    }
    console.log(productId);
    const newFile = await File.create({
      productId,
    });
    if (!newFile) {
      res.status(422).json({
        message: "faild to add file",
      });
    }
    return res(201).json({
      message: "sucessfully added files",
    });
  } catch (err) {
    console.log(err);
  }
};

// const productId = req.body;
// const files = req.files;
// console.log(productId);
// try {
//   const prod = await Product.findByPk(productId);
//   console.log(prod);
//   if (!prod) {
//     res.status(422).json({
//       message: "Invalid Product",
//     });
//   }
//   console.log(productId);
//
// } catch (err) {
//   console.log(err);
// }
