const ZipCode = require("../../models/zipCode");

// POST /admin/zipCodes/ => Add a new zipCode
exports.addZipCode = async (req, res, next) => {
  const { code, description } = req.body;

  if (!code)
    return res.status(422).json({
      message: "No zip code was given, unable to create a zip code.",
    });

  try {
    // TODO: in the validation set a custom validator to prevent
    // raise validation error if code already exists in database.
    const zipCode = await ZipCode.create({
      code,
      description,
    });

    if (!zipCode) {
      const newError = new Error("Unable to Create zipCode");
      newError.statusCode = 500;
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
  const prevZipCode = req.params.code;
  const { code, description } = req.body;

  // Not code, nor description was given
  if (!code && !zipCode) {
    return res.status(422).json({
      message: "Not code, nor description was given",
    });
  }

  try {
    let fetchedZipCode = await ZipCode.findByPk(prevZipCode);

    if (!fetchedZipCode) {
      return res.status(422).json({
        message: `Invalid zip code was given for update.`,
      });
    }

    if (description && !code) {
      fetchedZipCode.description = description;
      await fetchedZipCode.save();
    }

    // If any of code or description was given update the
    if (code) {
      await fetchedZipCode.destroy();
      fetchedZipCode = await ZipCode.create({ code, description });
    }

    // save the zip code
    return res.status(200).json({
      zipCode: fetchedZipCode,
      message: `Successfully updated the zipCode.`,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// DELETE /admin/zipCodes/:id => Delete a zipCode
exports.deleteZipCode = async (req, res, next) => {};
