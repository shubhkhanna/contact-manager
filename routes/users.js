const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");

// @type POST
// @route /api/v1/users
// @desc Register a user
// @access PUBLIC
router.post(
  "/",
  [
    body("name", "Please add name!").not().isEmpty(),
    body("email", "Please enter a valid email!").isEmail(),
    body(
      "password",
      "Please enter a password with 6 or more characters!"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Checking specified field exists or not
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Accepting form input
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // Checking User exists
      if (user) {
        return res.status(400).json({ msg: "Email Already Exists!" });
      }

      user = new User({ name, email, password });

      // Salting & storing hashed password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
