const Timing = require("../../models/timing");

exports.getTimings = async (req, res, next) => {
  try {
    const timings = await Timing.findAll();
    if (!timings) {
      const error = new Error("Failed to fetch timings");
      error.httpStatusCode = 500;
      throw error;
    }

    res.status(200).json({
      timings: timings,
      message: "Successfully fetched all timings",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
