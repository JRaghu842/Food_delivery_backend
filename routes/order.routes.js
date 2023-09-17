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

// read orders functionality

OrderRoute.get("/api/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user", "name email")
      .populate("restaurant", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});


// edit orders functionality

OrderRoute.put("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { items, totalPrice, deliveryAddress } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { items, totalPrice, deliveryAddress },
      { new: true }
    )
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


// delete order functionality

OrderRoute.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findByIdAndRemove(id);

    if (!order) {
      return res.status(404).json({ message: "Unable to find the order" });
    }

    res.json({ message: "Order has been deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});


module.exports = {
  OrderRoute,
};
