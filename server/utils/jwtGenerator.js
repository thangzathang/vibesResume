const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  // const payload = {
  //   user: user_id,
  // };

  const payload = {
    id: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "10minutes" });
}

module.exports = jwtGenerator;
