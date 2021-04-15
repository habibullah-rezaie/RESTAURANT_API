const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");
const File = require("../../models/file");
// POST /admin/products/
exports.addProduct = async (req, res, next) => {
  const { category, name, description, inPrice, outPrice, discount } = req.body;

  try {
    if (!category) {
      return res.status(422).json({
        message: "No category was given.",
      });
    }

    const ctg = await ProductCategory.findOne({
      where: {
        name: category,
      },
    });

    if (!ctg) {
      return res.status(422).json({
        message: "Unknown category.",
      });
    }

    const newProduct = await Product.create({
      title: name,
      description,
      inPrice,
      outPrice,
      discount,
    });

    if (!newProduct) {
      const err = new Error("Something went wrong, sorry!");
      err.statusCode = 500;
      throw err;
    }

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
  const { allergens, productId } = req.body;
  try {
    const prd = await Product.findByPk(productId);
    console.log(prd);
    if (!prd) {
      res.status(422).json({
        message: "Invalid product id",
      });
    }
    allergens.forEach(async (texts) => {
      const newAllergen = await Allergen.create({
        text: texts,
      });

      await newAllergen.setProduct(prd);
      res.status(201).json({
        product: req.body,
        message: "Allergen sucessfully created allergen",
      });
    });
  } catch (err) {
    console.log(err);
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
