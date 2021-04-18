const multer = require("multer");

/**
 * Multer disk storage for /admin/products/:productId/files
 */
exports.addFileMulterstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const newDate = new Date().toISOString();
    cb(null, `${req.admin}-${newDate}-${file.originalname}`);
  },
});
