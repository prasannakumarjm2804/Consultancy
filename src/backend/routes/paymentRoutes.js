const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const { authenticate } = require("../middleware/authenticate");
const Course = require("../models/course");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📌 **Create Order**
router.post("/create-order", authenticate, async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const options = {
      amount: course.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${courseId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 **Verify Payment**
router.post("/verify-payment", authenticate, async (req, res) => {
  const { courseId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  try {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    course.studentsEnrolled.push({ user: user._id, enrolledAt: new Date() });
    await course.save();

    user.courses.push(course._id);
    await user.save();

    res.json({ message: "Payment verified and user enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
