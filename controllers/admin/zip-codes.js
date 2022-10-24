const { validationResult } = require("express-validator");

const ZipCode = require("../../models/zipCode");
const { sendValidatorError } = require("../../utils/error");

// POST /admin/zipCodes/ => Add a new zipCode
exports.addZipCode = async (req, res, next) => {
  const { code, description } = req.body;

  if (!code)
    return res.status(422).json({
      message: "No zip code was given, unable to create a zip code.",
    });

  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  try {
    // TODO: in the validation set a custom validator to prevent
    // raise validation error if code already exists in database.
    const zipCode = await ZipCode.create({
      code,
      description,
    });

    if (!zipCode) {
      const newError = new Error("Unable to Create zipCode");
      newError.httpStatusCode = 500;
      throw newError;
    }

    res.status(201).json({
      zipCode: zipCode,
      message: "Successfully created a zip code.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// PUT /admin/zipCodes/:id => Change zipCode
exports.updateZipCode = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);
  const { description } = req.body;

  const zipCode = req.zipCode;
  try {
    zipCode.description = description;
    await zipCode.save();

    // save the zip code
    return res.status(200).json({
      zipCode: zipCode,
      message: `Successfully updated the zipCode.`,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// DELETE /admin/zipCodes/:id => Delete a zipCode
exports.deleteZipCode = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  try {
    const zipCode = req.zipCode;
    await zipCode.destroy();
    return res.status(200).json({
      message: "Successfully deleted the zipCode",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
