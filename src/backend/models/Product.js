const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  rating: { type: Number, default: 0 },
  material: { type: String },
  care: { type: String },
  availableColors: [{ type: String }],
  stock: { type: Number, default: 10 },
  isNewArrival: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true, collection: 'shop' });

module.exports = mongoose.model("Product", productSchema); 