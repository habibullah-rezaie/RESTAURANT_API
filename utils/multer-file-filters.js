const { validationResult } = require("express-validator");

/**
 * Multer file filterer for route
 * POST /admin/products/:productId/files
 */
exports.addFileMulterFilter = function Filter(req, file, cb) {
  // First check the validation results
  // maybe invalid product id given or
  // maximum number of files for a product is
  // reached
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array().map((e) => e.msg));
    err.specialType = "FILE_FILTER";
    err.statusCode = 421;
    return cb(err, false);
  }

  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4/;

  // Check ext
  const extname = filetypes.test(file.originalname);
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const err = new Error("Error: Images & videos Only!");
    err.specialType = "FILE_FILTER";
    err.statusCode = 421;
    cb(err, false);
  }
};
