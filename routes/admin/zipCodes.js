const express = require("express");
const { body, param } = require("express-validator");

const {
  addZipCode,
  updateZipCode,
  deleteZipCode,
} = require("../../controllers/admin/zip-codes");
const ZipCode = require("../../models/zipCode");

const router = express.Router();

// POST /admin/products/zipCodes/ => Add a zip code
router.post(
  "/",
  [
    body("code")
      .trim()
      .matches(/[0-9]{5}|[A-Za-z]{1}[0-9]{4}/)
      .withMessage("Invalid postal code."),
    body("description")
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Too long description"),
  ],
  addZipCode
);

// PUT /admin/products/zipCode/:code => Edit a zip code
router.put(
  "/:code",
  [
    body("code")
      .trim()
      .matches(/[0-9]{5}|[A-Za-z]{1}[0-9]{4}/)
      .withMessage("Invalid postal code.")
      .custom((code, { req }) => {
        return ZipCode.findByPk(code).then((zipCode) => {
          // code previously exists, so can not update it
          if (zipCode) {
            return Promise.reject(
              new Error(
                "Cannot updated the zip code with new zip code because the new zip code already exists in database."
              )
            );
          }
        });
      }),
    body("description")
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Too long description"),
  ],
  updateZipCode
);

// DELETE /admins/products/zipCodes/:code => delete a zip code
router.delete("/:code", deleteZipCode);

module.exports = router;
