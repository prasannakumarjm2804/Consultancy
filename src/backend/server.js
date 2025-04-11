require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes"); 
const adminRoutes = require("./routes/adminRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes"); 
const wishlistRoutes = require("./routes/wishlistRoutes");
const productRoutes = require("./routes/productRoutes");
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
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
// 🔹 **Start Server**
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
