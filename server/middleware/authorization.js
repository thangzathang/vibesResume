const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.token;

    // No token means no authorization
    if (!jwtToken) {
      return res.status(403).send({ message: "You are not authorized!" });
    }

    const payload = await jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = payload.user;

    next();
  } catch (error) {
    console.log("Serer error - authorized failed:", error);
    res.status(403).send({ message: "You are not authorized!" });
  }
};
