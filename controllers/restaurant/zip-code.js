const ZipCode = require("../../models/zipCode");

exports.getZipCodes = async (req, res, next) => {
  try {
    const zipCodes = await ZipCode.findAll();
    if (!zipCodes) {
      const error = new Error("Failed to fetch zip codes");
      error.httpStatusCode = 500;
      throw error;
    }

    res.status(200).json({
      zipCodes: zipCodes,
      message: "Successfully fetched all zip codes",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
