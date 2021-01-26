const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from Header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) res.status(401).json({ msg: "Authorization Denied!" });

  // Check if token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid!" });
  }
};
