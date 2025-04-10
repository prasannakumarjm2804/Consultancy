const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const auth = require("../middleware/auth");

// Get user's wishlist
router.get("/wishlist", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = new Wishlist({
        userId,
        items: []
      });
      await wishlist.save();
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to wishlist
router.post("/wishlist/add", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist
      wishlist = new Wishlist({
        userId,
        items: []
      });
    }

    // Check if product already exists in wishlist
    const itemExists = wishlist.items.some(item => item.productId === product.id);

    if (!itemExists) {
      // Add new item to wishlist
      wishlist.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        category: product.category,
        rating: product.rating,
        originalPrice: product.originalPrice
      });

      wishlist.lastUpdated = Date.now();
      await wishlist.save();
    }
    
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from wishlist
router.delete("/wishlist/item/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(item => item.productId !== parseInt(productId));
    wishlist.lastUpdated = Date.now();
    
    await wishlist.save();
    
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear wishlist
router.delete("/wishlist", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    wishlist.lastUpdated = Date.now();
    
    await wishlist.save();
    
    res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 