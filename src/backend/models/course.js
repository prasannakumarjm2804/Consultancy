const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: String, required: true },
  image: { type: String, required: true }, // Course image URL
  videos: [{ type: String }], // Array of video URLs
  pdfs: [{ type: String }], // Array of PDF URLs
  contentToBeCovered: [{ type: String }], // Array of content to be covered
  studentsEnrolled: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enrolledAt: { type: Date, default: Date.now }
  }],
  course_id: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
