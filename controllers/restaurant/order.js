const { validationResult } = require("express-validator");
const Address = require("../../models/address");
const Customer = require("../../models/customer");
const Order = require("../../models/order");
const OrderItem = require("../../models/OrderItem");

const { sendValidatorError } = require("../../utils/error");

exports.createOrder = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res, next);

  const products = req.products;

  try {
    const order = await Order.create({ isDone: false });

    if (!req.customer) {
      const {
        firstName,
        lastName,
        phoneNumber,
        address: giveAddress,
      } = req.body;
      const address = await Address.create({
        detail: giveAddress.detail,
      });
      // await ZipCode.setAddress(customer.address.zipCode);
      await address.setZip(req.zipCode);

      const createdCustomer = await Customer.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });

      await createdCustomer.setAddress(address);

      await order.setCustomer(createdCustomer);
    } else {
      await order.setCustomer(req.customer);
    }

    let total = 0;
    products.forEach((prd) => {
      prd.product.OrderItem = {
        qty: prd.qty,
        remark: prd.remark,
        inPrice: prd.product.inPrice,
        outPrice: prd.product.outPrice,
        discount: prd.product.discount,
      };

      total += prd.qty * prd.product.outPrice;

      prd.product.sells += prd.product.OrderItem.qty;
      prd.product.save();
    });

    order.total = total;
    order.save();

    await order.setProducts(products.map((prd) => prd.product));

    for (const prd of products) {
      const orderItem = await OrderItem.findOne({
        where: {
          OrderId: order.id,
          ProductId: prd.product.id,
        },
      });

      if (req.toppings[prd.product.id]) {
        orderItem.setToppings(req.toppings[prd.product.id]);
      }
    }

    return res.status(200).json({
      message: "Successfully ordered",
      order: order,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
