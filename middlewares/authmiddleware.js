const jwt = require("jsonwebtoken");

const authMiddlware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Not able to found token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWTKEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = {
  authMiddlware,
};
