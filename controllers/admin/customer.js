const { validationResult } = require("express-validator");

const Customer = require("../../models/customer");
const { sendValidatorError } = require("../../utils/error");

exports.getCustomers = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { firstName, lastName, phoneNumber, limit, page, order } = req.query;

  try {
    const whereClause = new Object();
    if (firstName) whereClause.firstName = firstName;
    if (lastName) whereClause.lastName = lastName;
    if (phoneNumber) whereClause.phoneNumber = phoneNumber;

    const customers = await Customer.findAll({
      where: whereClause,
      limit: limit ? +limit : 10,
      offset: page ? (+page - 1) * +limit : 0,
      order: [["createdAt", order]],
    });

    res.status(200).json({
      customers: customers,
      message: `Successfully fetched all users`,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  console.log(req.customer);
  res
    .status(200)
    .json({ customer: req.customer, message: "Successfully fetched user." });
};
