let express = require("express");
const { RestaurantModel } = require("../models/resturantmodel");

let RestaurantRoute = express.Router();

RestaurantRoute.post("/api/restaurants", async (req, res) => {
  try {
    const { name, address, menu } = req.body;

    const restaurant = new RestaurantModel({
      name,
      address,
      menu,
    });

    await restaurant.save();

    res.status(201).json({ message: "New Restaurant added succesfully" });
  } catch (error) {
    console.log(error);
  }
});

RestaurantRoute.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.status(200).send(restaurants);
  } catch (error) {
    console.log(error);
  }
});

RestaurantRoute.get("/api/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurants = await RestaurantModel.findById({ _id: id });

    if (!restaurants) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).send(restaurants);
  } catch (error) {
    console.log(error);
  }
});

RestaurantRoute.get("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById({ _id: id }, "menu");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).send(restaurant.menu);
  } catch (error) {
    console.log(error);
  }
});

RestaurantRoute.post("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const restaurant = await RestaurantModel.findById({ _id: id }, "menu");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = {
      name,
      description,
      price,
      image,
    };

    restaurant.menu.push(menuItem);
    await restaurant.save();

    res.status(201).send({ message: "Menu item added successfully" });
  } catch (error) {
    console.log(error);
  }
});

RestaurantRoute.delete("/api/restaurants/:id/menu/:id", async (req, res) => {
  try {
    const { id, menuItemId } = req.params;

    const restaurant = await RestaurantModel.findById({ _id: id }, "menu");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(menuItemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.remove();
    await restaurant.save();

    res.status(201).send({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  RestaurantRoute,
};
