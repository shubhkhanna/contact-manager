const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @type GET
// @route /api/v1/contacts
// @desc Get all contacts
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @type POST
// @route /api/v1/contacts
// @desc Add new contact
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    [
      body("name", "Please add name!").not().isEmpty(),
      body("email", "Please enter a valid email!").isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Checking specified field exists or not
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @type PUT
// @route /api/v1/contacts/:id
// @desc Update contact
// @access PRIVATE
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build Contact Object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found!" });
    }

    //Check User changes own contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "Not Authorized!" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @type DELETE
// @route /api/v1/contacts/:id
// @desc Delete contact
// @access PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found!" });
    }

    //Check User changes own contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "Not Authorized!" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
