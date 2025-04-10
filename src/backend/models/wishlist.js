const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  rating: { type: Number },
  originalPrice: { type: Number }
});

const wishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  items: [wishlistItemSchema],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema); 