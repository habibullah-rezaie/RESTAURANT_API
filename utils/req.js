const Product = require("../models/product");
const { throwError } = require("./error");

exports.getProductByIdInRequest = async (object, field) => {
  const id = object[field];

  if (!id) throwError("No product id was given.", 422);

  const product = await Product.findByPk(id);

  if (!product) throwError("No product found with given id.", 422);

  return product;
};
