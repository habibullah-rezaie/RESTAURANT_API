const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const {
  addProduct,
  addAllergrns,
  addAdditives,
  addToppings,
  addFile,
  addProductCategory,
} = require("../../controllers/admin/add-product");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");
const { isAuthenticated } = require("../../utils/auth");

const router = express.Router();

/**
 * Multer disk storage
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const admin = "habib";
    const newDate = new Date().toISOString();
    console.log(newDate);
    cb(null, `${newDate}-${file.originalname}`);
  },
});

/**
 *
 * Filter files by size and mimetype.
 */
function Filter(req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4/;

  // Check ext
  const extname = filetypes.test(file.originalname);
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images & videos Only!", false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15,
  },
  fileFilter: Filter,
});

// POST /admin/products/ -> add a product
router.post(
  "/",
  isAuthenticated,
  [
    body("category")
      .isString()
      .withMessage("No category, or invalid given.")
      .trim()
      .custom(async (ctg, { req }) => {
        if (!ctg) throw new Error("No category was given.");

        const fetchedCategory = await ProductCategory.findOne({
          where: { name: ctg },
        });

        if (!fetchedCategory) throw new Error("Unkown cateogry.");

        req.productCategory = fetchedCategory;
      }),
    body("name")
      .isString()
      .withMessage("Name should be string.")
      .trim()
      .isLength({ max: 64, min: 1 })
      .withMessage("Empty or too long product name."),
    body("description")
      .isString()
      .withMessage("Description should be string.")
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Too long product descriptoin."),
    body("discount")
      .isNumeric()
      .withMessage("Discount should be number.")
      .toFloat()
      .custom((discount, {}) => {
        if (discount < 0 || discount > 100)
          throw new Error("Discount must be between 0 and 100.");
        return true;
      }),
    body("inPrice")
      .isNumeric()
      .withMessage("inPrice should be number.")
      .toFloat()
      .custom((inPrice, {}) => {
        if (inPrice < 0) throw new Error("Price cannot be negative.");
        return true;
      }),
    body("outPrice")
      .isNumeric()
      .withMessage("outPrice should be number.")
      .toFloat()
      .custom((outPrice, { req }) => {
        if (outPrice < 0) throw new Error("Price cannot be negative.");
        if (outPrice < req.inPrice)
          throw new Error("Selling price cannot be less than primary price.");

        return true;
      }),
  ],
  addProduct
);

router.post(
  "/allergens",
  isAuthenticated,
  [
    body("productId")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
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
    body("allergens")
      .isArray()
      .withMessage("Allergens must be an array")
      .not()
      .isEmpty()
      .withMessage("Empty array of allergens. Aborting!"),
  ],
  addAllergrns
);

router.post(
  "/additives",
  isAuthenticated,
  [
    body("productId")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
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
    body("additives")
      .isArray()
      .withMessage("Additives must be an array")
      .not()
      .isEmpty()
      .withMessage("Empty array of Additives. Aborting!"),
  ],
  addAdditives
);

// POST /admin/products/toppings => create topping for a product
router.post(
  "/toppings",

  isAuthenticated,
  [
    body("productId")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id);
        if (!product) throw new Error("No product exist with given id");
        req.product = product;
      }),
    body("toppings")
      .isArray()
      .withMessage("Toppings must be an array")
      .not()
      .isEmpty()
      .withMessage("Empty array of toppings. Aborting!"),
  ],
  addToppings
);

// POST /admin/products/categories => create a cateogry 
router.post(
  "/categories",
  isAuthenticated,
  [
    body("name")
      .isString()
      .withMessage("Category title must be string.")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Empty or to long string for category title."),
    body("description")
      .isString()
      .withMessage("Category description must be string.")
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Too long string for category description."),
  ],
  addProductCategory
);

router.post("/categories", addProductCategory);
router.post("/files", upload.array("files", 10), addFile);

module.exports = router;
