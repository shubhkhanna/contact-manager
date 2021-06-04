const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from Header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) res.status(401).json({ msg: "Authorization Denied!" });

  // Check if token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid!" });
  }
};
