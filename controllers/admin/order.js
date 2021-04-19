const moment = require("moment");
const { validationResult } = require("express-validator");

const Order = require("../../models/order");
const { sendValidatorError } = require("../../utils/error");
const { Op } = require("sequelize");
const Customer = require("../../models/customer");
const Address = require("../../models/address");

// handle GET /admin/orders/
exports.getOrders = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const {
    startDate,
    endDate,
    phoneNumber,
    limit,
    page,
    orderBy,
    orderByDirection,
    isDone,
  } = req.query;

  try {
    const whereClause = {};

    if (isDone !== undefined) whereClause.isDone = isDone;

    if (phoneNumber)
      whereClause["$Customer.phoneNumber$"] = { [Op.eq]: phoneNumber };

    if (req.zipCode)
      whereClause["$Customer.Address.ZipCode$"] = { [Op.eq]: req.zipCode.code };

    const orders = await Order.findAndCountAll({
      offset: page ? (page - 1) * limit : 0,
      limit: limit ? limit : 24,
      order: [
        [orderBy, orderByDirection],
        ["createdAt", "DESC"],
      ],
      where: {
        createdAt: {
          [Op.between]: [
            moment(startDate || 0).format("YYYY-MM-DD HH:mm:ss"),
            moment(endDate || Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
        ...whereClause,
      },
      include: [
        {
          model: Customer,
          include: [{ model: Address }],
        },
      ],
    });

    res.status(200).json({
      count: orders.count,
      orders: orders.rows,
      message: "Successfully fetched orders.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// handle GET /admin/orders/:id
exports.getSingleOrder = async (req, res, next) => {};

// handle PATCH /admin/orders/:id
exports.changeOrderSentStatus = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { order } = req;

  try {
    console.log(order.isDone);
    order.isDone = !order.isDone;
    const savedOrder = await order.save();

    res.status(200).json({
      order: savedOrder,
      message: "Successfully updated order send status.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
