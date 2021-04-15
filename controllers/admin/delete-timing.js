const Timing = require("../../models/timing");
console.log("reached in controller");
exports.deleteTiming = async (req, res, next) => {
  const {day} = req.params;
  try {
    const findDay = await Timing.findByPk(day);
    if (!findDay) {
      res.status(422).json({
        Message: "Invalid day inserted",
      });
    }
    console.log(findDay);
    const deleteTiming = await Timing.destroy({
      where: {
        day:day
      },
    });
    if (!deleteTiming) {
      res.status(500).json({
        message: "Couldn`t delete product contact to 119",
      });
    }
    res.send({
      message: "Deleted sucessfully",
    });
  } catch (err) {
    console.log(err);
  }
};
