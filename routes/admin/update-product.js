const express = require("express");
const { body, param } = require("express-validator");

const {
  updateProduct,
  updateProductAllergen,
  updateProductAdditive,
  updateProductToppings,
  updateProductCategory,
} = require("../../controllers/admin/update-product");
const ProductCategory = require("../../models/productCategory");
const Product = require("../../models/product");
const Allergen = require("../../models/allergen");
const Additive = require("../../models/additive");
const Topping = require("../../models/topping");

const router = express.Router();

// PUT /admin/products/:id -> update a product
router.put(
  "/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id, {
          include: [
            {
              model: ProductCategory,
            },
          ],
        });
        if (!product) throw new Error("No product exist with given id");
        req.product = product;
      }),
    body().custom(async (reqBody, { req }) => {
      let {
        category,
        discount,
        name,
        description,
        inPrice,
        outPrice,
      } = reqBody;

      if (
        !category &&
        discount === undefined &&
        !name &&
        !description &&
        inPrice === undefined &&
        outPrice === undefined
      )
        throw new Error("Nothing to update. Aborting!");

      console.log(req.product);

      // if (category === req.product.ProductCategory.name && )
      if (category) {
        const fetchedCtg = await ProductCategory.findOne({
          where: {
            name: category,
          },
        });

        if (!fetchedCtg) throw new Error("Category does not exist");

        req.category = fetchedCtg;
      }

      if (name && (3 > name.length || name.length > 100)) {
        throw new Error("Invalid length for name");
      }

      if (description && description.length > 5000) {
        throw new Error("Invalid length for description");
      }

      if (inPrice !== undefined && Number.isNaN(Number.parseFloat(inPrice)))
        throw new Error("inPrice should be numeric");

      if (outPrice !== undefined && Number.isNaN(Number.parseFloat(outPrice)))
        throw new Error("inPrice should be numeric");

      if (discount !== undefined) {
        discount = Number.parseInt(discount);
        if (Number.isNaN(discount)) throw new Error("Invalid discount");
        if (-1 <= discount && discount <= 100) return true;
        throw new Error("Discount should only be 0 - 100.");
      }
    }),
  ],
  updateProduct
);

// PUT /admin/products/allergen/id -> change the text of a specifiec allergen
router.put(
  "/allergens/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const allergen = await Allergen.findByPk(id);
        if (!allergen) throw new Error("No allergen exist with given id");
        req.allergen = allergen;
      }),

    body().custom(async (reqBody, { req }) => {
      let { text, productId } = reqBody;

      if (!text && !productId) throw new Error("Nothing to update. Aborting!");

      if (productId && productId.length > 36) {
        throw new Error("Invalid length for productId");
      }

      if (productId) {
        const fetchedProduct = await Product.findByPk(productId);

        if (!fetchedProduct) throw new Error("Product does not exist");
      }

      if (text && (3 > text.length || text.length > 1500)) {
        throw new Error("Invalid length for text");
      }
    }),
  ],
  updateProductAllergen
);

// PUT /admin/products/additives/id -> change the text of a specifiec additives
router.put(
  "/additives/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const additive = await Additive.findByPk(id);
        if (!additive) throw new Error("No additive exist with given id");
        req.additive = additive;
      }),

    body().custom(async (reqBody, { req }) => {
      let { text, productId } = reqBody;

      if (!text && !productId) throw new Error("Nothing to update. Aborting!");

      if (productId && productId.length > 36) {
        throw new Error("Invalid length for productId");
      }

      if (productId) {
        const fetchedProduct = await Product.findByPk(productId);

        if (!fetchedProduct) throw new Error("Product does not exist");
      }

      if (text && (3 > text.length || text.length > 1500)) {
        throw new Error("Invalid length for text");
      }
    }),
  ],
  updateProductAdditive
);

// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put(
  "/toppings/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const topping = await Topping.findByPk(id);
        console.log(topping);
        if (!topping) throw new Error("No topping exist with given id");
        req.topping = topping;
      }),

    body().custom(async (reqBody, { req }) => {
      let { title, price } = reqBody;

      if (!title && !price) throw new Error("Nothing to update. Aborting!");

      if (title && (3 > title.length || title.length > 100)) {
        throw new Error("Invalid length for text");
      }

      if (price !== undefined && Number.isNaN(Number.parseFloat(price)))
        throw new Error("Price should be numeric");
    }),
  ],
  updateProductToppings
);

// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put(
  "/categories/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const category = await ProductCategory.findByPk(id);
        console.log(category);
        if (!category) throw new Error("No topping exist with given id");
        req.category = category;
      }),

    body().custom(async (reqBody, { req }) => {
      let { name, description } = reqBody;

      if (!name && !description)
        throw new Error("Nothing to update. Aborting!");

      if (name && (3 > name.length || name.length > 100)) {
        throw new Error("Invalid length for text");
      }

      if (description && description.length > 5000) {
        throw new Error("Invalid length for description");
      }
    }),
  ],
  updateProductCategory
);

module.exports = router;
