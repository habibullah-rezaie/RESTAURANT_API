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
exports.addZipCode = async (req, res, next) => {}

// DELETE /admin/zipCodes/:id => Delete a zipCode
exports.addZipCode = async (req, res, next) => {}