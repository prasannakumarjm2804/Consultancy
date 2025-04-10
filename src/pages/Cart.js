import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Cart.css";
import CartService from "../services/CartService";

const Cart = () => {
  // State variables
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (isLoggedIn) {
        synchronizeData();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      showNotificationMessage("You are offline. Changes will be saved locally and synchronized when you're back online.", "warning");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isLoggedIn]);

  // Synchronize data when coming back online
  const synchronizeData = useCallback(async () => {
    try {
      if (!isLoggedIn || !isOnline) return;
      
      setIsSyncing(true);
      showNotificationMessage("Synchronizing your cart data...", "info");
      
      const cartSynced = await CartService.synchronizeCart();
      const wishlistSynced = await CartService.synchronizeWishlist();
      
      if (cartSynced || wishlistSynced) {
        // If data was synced, reload from server
        loadCartAndWishlist();
        showNotificationMessage("Your cart has been synchronized with the server.", "success");
      }
    } catch (error) {
      console.error("Error synchronizing data:", error);
      showNotificationMessage("Failed to synchronize your data. Will try again later.", "error");
    } finally {
      setIsSyncing(false);
    }
  }, [isLoggedIn, isOnline]);

  // Load cart and wishlist
  const loadCartAndWishlist = useCallback(async () => {
    try {
      setLoading(true);

      // Get cart and wishlist (the enhanced service handles online/offline automatically)
      const cartData = await CartService.getCart();
      const wishlistData = await CartService.getWishlist();
      
      setCartItems(cartData?.items || []);
      setWishlistItems(wishlistData?.items || []);
    } catch (error) {
      console.error("Error loading cart/wishlist:", error);
      showNotificationMessage(
        error.userMessage || "Failed to load your cart. Please try again later.", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    loadCartAndWishlist();
  }, [loadCartAndWishlist]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return couponApplied ? (calculateSubtotal() * discount) / 100 : 0;
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.18; // 18% tax (GST)
  };

  const calculateShipping = () => {
    // Free shipping for orders over ₹2000
    return calculateSubtotal() > 2000 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax() + calculateShipping();
  };

  // Update cart item quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const product = cartItems.find(item => item.id === id || item.productId === id);
    
    if (product && newQuantity <= product.stock) {
      try {
        const result = await CartService.updateItemQuantity(id, newQuantity);
        
        if (result) {
          setCartItems(result.items || cartItems.map(item => 
            (item.id === id || item.productId === id) ? { ...item, quantity: newQuantity } : item
          ));
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        showNotificationMessage(
          error.userMessage || "Failed to update quantity. Please try again.", 
          "error"
        );
      }
    } else {
      showNotificationMessage("Cannot add more items than available in stock!", "error");
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      const productToRemove = cartItems.find(item => item.id === id || item.productId === id);
      
      const result = await CartService.removeFromCart(id);
      
      if (result) {
        setCartItems(result.items || []);
        showNotificationMessage(`${productToRemove?.name || 'Item'} removed from cart!`, "info");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showNotificationMessage(
        error.userMessage || "Failed to remove item. Please try again.", 
        "error"
      );
    }
  };

  // Move item from cart to wishlist
  const moveToWishlist = async (id) => {
    try {
      const item = cartItems.find(item => item.id === id || item.productId === id);
      
      if (item) {
        const isInWishlist = wishlistItems.some(wishlistItem => 
          wishlistItem.id === id || wishlistItem.productId === id
        );
        
        if (!isInWishlist) {
          const wishlistResult = await CartService.addToWishlist(item);
          
          if (wishlistResult) {
            setWishlistItems(wishlistResult.items || []);
          }
        }
        
        // Remove from cart
        const cartResult = await CartService.removeFromCart(id);
        
        if (cartResult) {
          setCartItems(cartResult.items || []);
          showNotificationMessage(`${item.name} moved to wishlist!`, "success");
        }
      }
    } catch (error) {
      console.error("Error moving to wishlist:", error);
      showNotificationMessage(
        error.userMessage || "Failed to move item to wishlist. Please try again.", 
        "error"
      );
    }
  };

  // Move item from wishlist to cart
  const moveToCart = async (id) => {
    try {
      const item = wishlistItems.find(item => item.id === id || item.productId === id);
      
      if (item) {
        const existingCartItem = cartItems.find(cartItem => 
          cartItem.id === id || cartItem.productId === id
        );
        
        let cartResult;
        
        if (existingCartItem) {
          // If already in cart, increase quantity
          cartResult = await CartService.updateItemQuantity(id, existingCartItem.quantity + 1);
        } else {
          // Add to cart
          cartResult = await CartService.addToCart(item, 1);
        }
        
        if (cartResult) {
          setCartItems(cartResult.items || []);
        }
        
        // Remove from wishlist
        const wishlistResult = await CartService.removeFromWishlist(id);
        
        if (wishlistResult) {
          setWishlistItems(wishlistResult.items || []);
          showNotificationMessage(`${item.name} added to cart!`, "success");
        }
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
      showNotificationMessage(
        error.userMessage || "Failed to move item to cart. Please try again.", 
        "error"
      );
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id) => {
    try {
      const productToRemove = wishlistItems.find(item => item.id === id || item.productId === id);
      
      const result = await CartService.removeFromWishlist(id);
      
      if (result) {
        setWishlistItems(result.items || []);
        showNotificationMessage(`${productToRemove?.name || 'Item'} removed from wishlist!`, "info");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showNotificationMessage(
        error.userMessage || "Failed to remove item from wishlist. Please try again.", 
        "error"
      );
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setDiscount(10);
      showNotificationMessage("Coupon applied successfully! 10% off your purchase.", "success");
    } else if (couponCode.toUpperCase() === "SUMMER20") {
      setCouponApplied(true);
      setDiscount(20);
      showNotificationMessage("Coupon applied successfully! 20% off your purchase.", "success");
    } else {
      showNotificationMessage("Invalid coupon code. Please try again.", "error");
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
    setCouponCode("");
    showNotificationMessage("Coupon removed.", "info");
  };

  // Show notification message
  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Render star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star">★</span>);
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-star-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const result = await CartService.clearCart();
      
      if (result) {
        setCartItems([]);
        showNotificationMessage("Cart cleared!", "info");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      showNotificationMessage(
        error.userMessage || "Failed to clear cart. Please try again.", 
        "error"
      );
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotificationMessage("Your cart is empty!", "error");
      return;
    }
    
    // In a real application, this would redirect to a checkout page
    alert("Proceeding to checkout. This would normally redirect to a payment gateway.");
  };

  // Loading state
  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className={`notification ${notificationType}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            className="offline-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <span className="offline-icon">📶</span>
            <p>You are currently offline. Your changes will be saved locally and synchronized when you're back online.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Syncing Indicator */}
      {isSyncing && (
        <div className="syncing-indicator">
          <div className="syncing-spinner"></div>
          <span>Synchronizing your data...</span>
        </div>
      )}

      <div className="cart-container">
        <h1 className="page-title">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-header">
                <div className="product-col">Product</div>
                <div className="price-col">Price</div>
                <div className="quantity-col">Quantity</div>
                <div className="total-col">Total</div>
                <div className="actions-col">Actions</div>
              </div>
              
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id || item.productId}>
                    <div className="product-col">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="product-info">
                        <h3>{item.name}</h3>
                        <div className="product-rating">
                          <div className="stars">
                            {renderRatingStars(item.rating)}
                          </div>
                          <span className="review-count">({item.reviews || '0'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="price-col">
                      <div className="product-price">
                        <span className="current-price">₹{item.price ? item.price.toLocaleString() : '0'}</span>
                        {item.originalPrice && (
                          <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="quantity-col">
                      <div className="quantity-selector">
                        <button 
                          className="quantity-btn decrement"
                          onClick={() => updateQuantity(item.id || item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          max={item.stock} 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id || item.productId, parseInt(e.target.value))}
                          readOnly
                        />
                        <button 
                          className="quantity-btn increment"
                          onClick={() => updateQuantity(item.id || item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="total-col">
                      <span className="item-total">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    
                    <div className="actions-col">
                      <button 
                        className="remove-btn" 
                        onClick={() => removeFromCart(item.id || item.productId)}
                        aria-label="Remove from cart"
                      >
                        <span className="icon">🗑️</span>
                      </button>
                      <button 
                        className="move-to-wishlist-btn" 
                        onClick={() => moveToWishlist(item.id || item.productId)}
                        aria-label="Move to wishlist"
                      >
                        <span className="icon">♡</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-actions">
                <Link to="/shop" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              {couponApplied && (
                <div className="summary-row discount">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{calculateDiscount().toLocaleString()}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{calculateTax().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {calculateShipping() === 0 
                    ? <span className="free-shipping">FREE</span> 
                    : `₹${calculateShipping().toLocaleString()}`
                  }
                </span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              
              <div className="coupon-section">
                <h3>Apply Coupon</h3>
                {!couponApplied ? (
                  <div className="coupon-input">
                    <input 
                      type="text" 
                      placeholder="Enter coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      className="apply-coupon-btn"
                      onClick={applyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="applied-coupon">
                    <span className="coupon-tag">
                      {couponCode.toUpperCase()} ({discount}% off)
                    </span>
                    <button 
                      className="remove-coupon-btn"
                      onClick={removeCoupon}
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                <div className="available-coupons">
                  <h4>Available Coupons:</h4>
                  <div className="coupon">
                    <span className="coupon-code">WELCOME10</span>
                    <span className="coupon-description">10% off your first order</span>
                  </div>
                  <div className="coupon">
                    <span className="coupon-code">SUMMER20</span>
                    <span className="coupon-description">20% off summer collection</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="payment-methods">
                <h4>We Accept</h4>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Wishlist Section */}
        <div className="wishlist-section">
          <h2 className="section-title">Your Wishlist</h2>
          
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <p>Your wishlist is empty. Add items to your wishlist to save for later!</p>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map((item) => (
                <div className="wishlist-item" key={item.id || item.productId}>
                  <div className="wishlist-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="wishlist-item-details">
                    <h3>{item.name}</h3>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {renderRatingStars(item.rating)}
                      </div>
                      <span className="review-count">({item.reviews || '0'})</span>
                    </div>
                    
                    <div className="product-price">
                      <span className="current-price">₹{item.price ? item.price.toLocaleString() : '0'}</span>
                      {item.originalPrice && (
                        <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                      {item.discount && (
                        <span className="discount-percentage">-{item.discount}%</span>
                      )}
                    </div>
                    
                    <div className="product-stock">
                      {item.stock > 0 ? (
                        <span className="in-stock">In Stock ({item.stock})</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="wishlist-item-actions">
                    <button 
                      className="move-to-cart-btn"
                      onClick={() => moveToCart(item.id || item.productId)}
                      disabled={item.stock === 0}
                    >
                      {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button 
                      className="remove-wishlist-btn"
                      onClick={() => removeFromWishlist(item.id || item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
