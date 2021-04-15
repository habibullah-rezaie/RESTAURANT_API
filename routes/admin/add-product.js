const express = require("express");
const multer = require("multer");
const {
  addProduct,
  addAllergrns,
  addAdditives,
  addToppings,
  addFile,
  addProductCategory,
} = require("../../controllers/admin/add-product");
const router = express.Router();

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
router.post("/", addProduct);
router.post("/allergens", addAllergrns);
router.post("/additives", addAdditives);
router.post("/toppings", addToppings);
router.post("/categories", addProductCategory);
router.post("/files", upload.array("files", 10), addFile);

module.exports = router;
