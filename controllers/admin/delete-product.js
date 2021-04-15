const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const Topping = require("../../models/topping");
exports.deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await Product.findByPk(id);
    if (!id) {
      res.status(422).json({
        Message: "Invalid ProductId",
      });
    }
    console.log(prod);
    const deletePreoduct = await Product.destroy({
      where: {
        id: id,
      },
    });
    if (!deletePreoduct) {
      res.status(500).json({
        message: "Couldn`t delete product contact to 119",
      });
    }
    res.send({
      message: "Deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteProductImage = async (req, res, next) => {};
exports.deleteProductAllergen = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await Allergen.findByPk(id);
    console.log(prod);
    if (!prod) {
      return res.status(422).json({
        Message: "Invalid Allergen",
      });
    }
    console.log(prod);
    const deleteAllergen = await Allergen.destroy({
      where: {
        id: id,
      },
    });
    if (!deleteAllergen) {
      return res.status(500).json({
        message: "Couldn`t delete Alergen contact to 119",
      });
    }
    return res.json({
      message: "Allergen Deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
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
