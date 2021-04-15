const Timing = require("../../models/timing");
exports.addtiming = async (req, res, next) => {
  const { day, opening, closing } = req.body;
  console.log(`in controller you see${day}${opening}${closing}`);
  console.log("reached here");
  try {
    const newTiming = await Timing.create({
      day: day,
      opening: opening,
      closing: closing,
    });
    if (!newTiming) {
      res.status(422).json({
        message: "There was an error in setting time",
      });
    }
    return res.status(201).json({
      message: "timing was set",
    });
  } catch (error) {
    console.log(error);
  }
};
