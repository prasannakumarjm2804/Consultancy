const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true },
  category: { type: String },
  rating: { type: Number },
  originalPrice: { type: Number }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  items: [cartItemSchema],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema); 