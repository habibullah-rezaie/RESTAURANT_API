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
router.put("/allergens/:id", updateProductAllergen);

// PUT /admin/products/additives/id -> change the text of a specifiec additives
router.put("/additives/:id", updateProductAdditive);

// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put("/toppings/:id", updateProductToppings);

// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put("/categories/:id", updateProductCategory);

module.exports = router;
