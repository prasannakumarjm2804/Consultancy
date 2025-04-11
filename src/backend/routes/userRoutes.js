require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Admin = require("../models/admin"); // Import Admin model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { authenticate } = require("../middleware/authenticate");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// 🔹 **Nodemailer Config**
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  debug: true,
  tls: {
    rejectUnauthorized: false,
  }
});

// 🔹 **Generate OTP**
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// 📌 **Send OTP Route**
router.post("/send-otp", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({ error: "Email already verified!" });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Invalid password! Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Generate OTP & Hash Password
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update or Insert User
    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp, otpExpiry, verified: false },
      { upsert: true, new: true }
    );
    //console.log("User:", user);
    // Send OTP Email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code for Amika's Boutique",
      text: `Hello ${name},  
    
    Thank you for signing up at **Amika's Boutique!**  
    
    To complete your registration and secure your account, please use the following OTP code:  
    
    🔹 **Your OTP Code:** ${otp}  
    
    This OTP is valid for **5 minutes**. Please enter it in the verification field to proceed.  
    
    If you did not request this OTP, please ignore this email.  
    
    For any assistance, feel free to contact our support team.  
    
    Happy Shopping!  
    **Amika's Boutique Team**  
    📧 support@amikasboutique.com  
    `,
    };
    
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error); // Log the error to the terminal
    res.status(500).json({ error: "Error sending OTP. Please try again." });
  }
});

// 📌 **Verify OTP & Register User**
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.verified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  // ✅ Generate JWT Token
  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "OTP verified, user registered successfully", token, user: { name: user.name, email: user.email } });
});

// 📌 **Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  

  try {
    // Check if the user is an admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isAdminMatch = await bcrypt.compare(password, admin.password);
      if (!isAdminMatch) {
        console.log("Admin password mismatch");
        return res.status(400).json({ error: "Invalid password for admin!" });
      }

      const adminToken = jwt.sign(
        { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        token: adminToken,
        user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
        redirectUrl: "/admin-homepage"
      });
    }

    // Regular user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("User password mismatch");
      return res.status(400).json({ error: "Invalid password!" });
    }

    const userToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: "user" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token: userToken,
      user: { id: user._id, name: user.name, email: user.email, role: "user" },
      redirectUrl: "/user-homepage"
    });
  } catch (err) {
    console.error("Internal login error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 📌 **Get User Profile (Protected Route)**
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('courses').select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
