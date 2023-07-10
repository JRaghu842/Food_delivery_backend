let express = require("express");
let UserRoute = express.Router();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config;

const { UserModel } = require("../models/usermodel");

UserRoute.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      address,
    });

    await user.save();

    res.status(201).json({ message: "User registration successfull" });
  } catch (error) {
    console.log(error);
  }
});

UserRoute.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWTKEY, {
      expiresIn: 1000 * 60 * 60,
    });

    res.status(201).json({ message: "User Login successfull", token });
  } catch (error) {
    console.log(error);
  }
});

UserRoute.patch("/api/user/:id/reset", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentpass, newpass } = req.body;
    const user = await UserModel.findById({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(currentpass, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = bcrypt.hashSync(newpass, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(201).send({ message: "Password successfuly reset" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  UserRoute,
};
