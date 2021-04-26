const { validationResult } = require("express-validator");

const Customer = require("../../models/customer");
const { sendValidatorError } = require("../../utils/error");

exports.getCustomers = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { firstName, lastName, phoneNumber, limit, page, order } = req.query;

  // Calculdate limit & page
  const LIMIT = limit ? limit : 10;
  const PAGE = page ? (page - 1) * LIMIT : page;

  try {
    const whereClause = new Object();
    if (firstName) whereClause.firstName = firstName;
    if (lastName) whereClause.lastName = lastName;
    if (phoneNumber) whereClause.phoneNumber = phoneNumber;

    const customers = await Customer.findAndCountAll({
      where: whereClause,
      limit: LIMIT,
      offset: PAGE,
      order: [["createdAt", order]],
    });

    res.status(200).json({
      customers: customers.rows,
      count: customers.count,
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
