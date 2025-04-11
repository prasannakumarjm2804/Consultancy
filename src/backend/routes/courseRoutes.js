const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user"); 
const { authenticate } = require("../middleware/authenticate");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 📌 **Check if User Bought Course (Move this above `/:id`)**
router.get("/user/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid Course ID" });

    try {
        const user = await User.findById(req.user.userId).populate('courses');
        if (user && user.courses.some(course => course._id.toString() === id)) {
            return res.json({ hasBought: true });
        }
        return res.json({ hasBought: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 **Get All Courses**
router.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        res.setHeader("Content-Type", "application/json");
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 **Get Course by ID**
router.get("/courses/:id", async (req, res) => {
    const { id } = req.params;

    if (id === "favicon.ico") return res.status(204).end(); // Ignore favicon request
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid Course ID" });

    try {
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 **Enroll User in Course**
router.post("/enroll", authenticate, async (req, res) => {
    const { courseId } = req.body;

    if (!isValidObjectId(courseId)) return res.status(400).json({ error: "Invalid Course ID" });

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (course.studentsEnrolled.some(enrollment => enrollment.user.toString() === user._id.toString())) {
            return res.status(400).json({ error: "User already enrolled in this course" });
        }

        course.studentsEnrolled.push({ user: user._id, enrolledAt: new Date() });
        await course.save();

        user.courses.push(course._id);
        await user.save();

        res.json({ message: "User enrolled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 Create a New Course
router.post("/courses", authenticate, async (req, res) => {
    const {
        title,
        description,
        price,
        instructor,
        image,
        videos,
        pdfs,
        contentToBeCovered,
        course_id
    } = req.body;

    if (!title || !description || !price || !instructor || !image || !course_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newCourse = new Course({
            title,
            description,
            price,
            instructor,
            image,
            videos: videos || [],
            pdfs: pdfs || [],
            contentToBeCovered: contentToBeCovered || [],
            course_id
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while creating course" });
    }
});

module.exports = router;
