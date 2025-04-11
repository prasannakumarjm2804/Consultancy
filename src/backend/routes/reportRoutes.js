const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../models/course");

router.get("/reports", async (req, res) => {
  try {
    const { reportType, courseId, startDate, endDate, month, year } = req.query;
    let matchStage = {};

    // Validate and filter by course ID
    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      matchStage["_id"] = new mongoose.Types.ObjectId(courseId);
    }

    // Apply date filters based on report type
    if (reportType === "day" && startDate && endDate) {
      matchStage["studentsEnrolled.enrolledAt"] = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    } else if (reportType === "month" && month && year) {
      const monthInt = parseInt(month, 10); // Ensure proper conversion
      const yearInt = parseInt(year, 10);

      if (!monthInt || !yearInt || monthInt < 1 || monthInt > 12) {
        return res.status(400).json({ error: "Invalid month or year" });
      }

      // Start of the month
      const startOfMonth = new Date(yearInt, monthInt - 1, 1, 0, 0, 0, 0);
      // End of the month
      const endOfMonth = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);

      matchStage["studentsEnrolled.enrolledAt"] = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    } else if (reportType === "year" && year) {
      const yearInt = parseInt(year, 10);
      if (!yearInt) {
        return res.status(400).json({ error: "Invalid year" });
      }

      matchStage["studentsEnrolled.enrolledAt"] = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
      };
    }

    

    // Aggregation Query
    const reportData = await Course.aggregate([
      { $match: matchStage },
      { $unwind: "$studentsEnrolled" },
      {
        $lookup: {
          from: "users",
          localField: "studentsEnrolled.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          enrolledAt: "$studentsEnrolled.enrolledAt",
          course: "$title",
          studentName: "$userDetails.name",
          studentEmail: "$userDetails.email",
        },
      },
      {
        $group: {
          _id:
            reportType === "day"
              ? {
                  day: { $dayOfMonth: "$enrolledAt" },
                  month: { $month: "$enrolledAt" },
                  year: { $year: "$enrolledAt" },
                }
              : reportType === "month"
              ? {
                  month: { $month: "$enrolledAt" },
                  year: { $year: "$enrolledAt" },
                }
              : { year: { $year: "$enrolledAt" } },
          users: {
            $push: {
              name: "$studentName",
              email: "$studentEmail",
              course: "$course",
              date: "$enrolledAt",
            },
          },
        },
      },
    ]);

    
    res.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
