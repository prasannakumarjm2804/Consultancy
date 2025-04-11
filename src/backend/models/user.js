const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  courses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    enrolledAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


