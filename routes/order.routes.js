let express = require("express");
const { OrderModel } = require("../models/ordermodel");

let OrderRoute = express.Router();

OrderRoute.post("/api/orders", async (req, res) => {
  try {
    const { userId, restaurantId, items, totalPrice, deliveryAddress } =
      req.body;

    const order = new OrderModel({
      user: userId,
      restaurant: restaurantId,
      items,
      totalPrice,
      deliveryAddress,
      status: "placed",
    });

    await order.save();

    res.status(201).send({ message: "Order has been successfully placed" });
  } catch (error) {
    console.log(error);
  }
});

OrderRoute.post("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findById(id)
      .populate("user", "name email")
      .populate("restaurant", "name");

    if (!order) {
      return res.status(404).json({ message: "Unable to find the order" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  OrderRoute,
};
