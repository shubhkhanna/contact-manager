const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");

// @type GET
// @route /api/v1/auth
// @desc Get logged in user
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @type POST
// @route /api/v1/auth/login
// @desc Authenticate user & get token
// @access PUBLIC
router.post(
  "/login",
  [
    body("email", "Please enter a valid email!").isEmail(),
    body("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Checking specified field exists or not
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

    // Accepting form input
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // Checking User exists
      if (!user) res.status(400).json({ msg: "Invalid Credentials!" });

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) res.status(400).json({ msg: "Invalid Credentials!" });

      // Creating user object
      const payload = {
        user: { id: user.id },
      };

      // Generating token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;
