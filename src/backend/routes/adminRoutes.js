const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../models/admin");

// Route to check if a user is an admin
router.post("/check", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isPasswordValid) {
        return res.json({ isAdmin: true }); // Admin verified
      } else {
        return res.status(401).json({ message: "Invalid password" }); // Incorrect password
      }
    } else {
      return res.json({ isAdmin: false }); // Not an admin
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to create a new admin (for setup purposes)
router.post("/create", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, name, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
