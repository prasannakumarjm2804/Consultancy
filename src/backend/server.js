require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes"); // Import report routes
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const cartRoutes = require("./routes/cartRoutes"); // Import cart routes
const wishlistRoutes = require("./routes/wishlistRoutes"); // Import wishlist routes

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🔹 **MongoDB Connection**
//const MONGO_URI = "mongodb+srv://sanmathys22msc:SKxtIQsNiJu2bfhL@ambikasboutique.e22fzcb.mongodb.net/ambikasboutique?retryWrites=true&w=majority";

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err.message));



// 🔹 **Routes**
app.use("/", userRoutes);
app.use("/", courseRoutes);
app.use("/", reportRoutes); 
app.use("/", adminRoutes);
app.use("/", cartRoutes); // Add cart routes
app.use("/", wishlistRoutes); // Add wishlist routes

// 🔹 **Start Server**
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
