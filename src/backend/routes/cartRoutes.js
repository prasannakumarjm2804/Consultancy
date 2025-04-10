const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const auth = require("../middleware/auth");

// Get user's cart
router.get("/cart", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({
        userId,
        items: []
      });
      await cart.save();
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update entire cart
router.put("/cart", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: items || []
      });
    } else {
      cart.items = items || [];
      cart.lastUpdated = Date.now();
    }

    await cart.save();
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
router.post("/cart/add", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product, quantity = 1 } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId,
        items: []
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(item => item.productId === product.id);

    if (itemIndex > -1) {
      // Update existing item quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        stock: product.stock,
        category: product.category,
        rating: product.rating,
        originalPrice: product.originalPrice
      });
    }

    cart.lastUpdated = Date.now();
    await cart.save();
    
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/cart/item/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId !== parseInt(productId));
    cart.lastUpdated = Date.now();
    
    await cart.save();
    
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update item quantity
router.put("/cart/item/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items = cart.items.filter(item => item.productId !== parseInt(productId));
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    cart.lastUpdated = Date.now();
    await cart.save();
    
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart
router.delete("/cart", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.lastUpdated = Date.now();
    
    await cart.save();
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 