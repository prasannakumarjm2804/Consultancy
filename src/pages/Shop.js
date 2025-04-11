import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaSearch, FaTimes, FaFilter, FaArrowRight, FaStar, FaHeart, FaShare, FaRupeeSign } from "react-icons/fa";
import "../styles/Shop.css";
import CartService from "../Services/CartService";
import axios from "axios";

const Shop = () => {
  // State declarations
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [priceRange, setPriceRange] = useState(20000);
  const [activeCategory, setActiveCategory] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
    product: null
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(20000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isFilterSummaryOpen, setIsFilterSummaryOpen] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [slideshowImages, setSlideshowImages] = useState([
    {
      url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      title: "Elegant Ethnic Collection",
      subtitle: "Discover our beautifully crafted traditional wear for all occasions",
      buttonText: "Shop Now"
    },
    {
      url: "https://images.unsplash.com/photo-1585914924626-15adac1e6402?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      title: "Festival Season Special",
      subtitle: "Celebrate with our vibrant and colorful festive collection",
      buttonText: "Explore"
    },
    {
      url: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      title: "Wedding Collection",
      subtitle: "Make your special day memorable with our exclusive bridal wear",
      buttonText: "View Collection"
    }
  ]);

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        
        // Create slideshow images from featured products
        const featuredProducts = response.data
          .filter(product => product.tags?.includes("featured"))
          .slice(0, 3)
          .map(product => ({
            url: product.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
            title: product.title || "Elegant Collection",
            subtitle: product.description?.substring(0, 100) + "..." || "Discover our beautifully crafted collection",
            buttonText: "Shop Now"
          }));
        
        // Only update slideshowImages if we have a complete set of featured products with images
        if (featuredProducts.length >= 3 && featuredProducts.every(p => p.url && p.title)) {
          setSlideshowImages(featuredProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get all unique brands from products
  const allBrands = [...new Set(products.map(product => product.brand))];

  // Available colors for filter
  const availableColors = [
    { name: "Red", code: "#d32f2f" },
    { name: "Gold", code: "#ffd700" },
    { name: "Blue", code: "#1976d2" },
    { name: "Green", code: "#388e3c" },
    { name: "Pink", code: "#ec407a" },
    { name: "Purple", code: "#8e24aa" },
    { name: "Black", code: "#212121" },
    { name: "White", code: "#f5f5f5" },
    { name: "Beige", code: "#e1ceb1" },
    { name: "Maroon", code: "#821717" }
  ];

  // Popular filter presets
  const popularFilters = [
    { name: "Wedding Collection", category: "bridal", brands: ["Sabyasachi", "Manyavar"], minPrice: 5000 },
    { name: "Casual Ethnic", category: "kurtis", brands: ["Fabindia", "W for Woman"], maxPrice: 3000 },
    { name: "Traditional Silk", category: "sarees", brands: ["Pothys", "Chennai Silks"], colors: ["Red", "Gold"] },
    { name: "Budget Friendly", minPrice: 0, maxPrice: 2000 }
  ];

  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'sarees', name: 'Sarees' },
    { id: 'blouses', name: 'Blouses' },
    { id: 'suitsets', name: 'Suit Sets' },
    { id: 'kurtis', name: 'Kurtis' },
    { id: 'bottomwear', name: 'Bottom Wear' },
    { id: 'lehengas', name: 'Lehengas' },
    { id: 'bridal', name: 'Bridal Wear' }
  ];

  // Initialize loading state
  useEffect(() => {
    // Load cart and wishlist data
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Load cart data
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data", error);
      }
    }
    
    // Load wishlist data
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist data", error);
      }
    }

    // Add ESC key listener for modal
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Slideshow interval
  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(slideshowInterval);
  }, [slideshowImages.length]);

  // Show notification with product info
  const showNotification = (message, type = "success", product = null) => {
    setNotification({
      show: true,
      message,
      type,
      product
    });
    
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
        product: null
      });
    }, 3000);
  };

  // Toggle brand filter
  const toggleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Toggle color filter
  const toggleColorFilter = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Apply popular filter preset
  const applyPresetFilter = (preset) => {
    if (preset.category) {
      // Check if the category exists in our categories array
      const categoryExists = categories.some(cat => cat.id === preset.category);
      setActiveCategory(categoryExists ? preset.category : "all");
    } else {
      setActiveCategory("all");
    }
    
    if (preset.brands) {
      // Check if the brands exist in our allBrands array
      const validBrands = preset.brands.filter(brand => allBrands.includes(brand));
      setSelectedBrands(validBrands);
    } else {
      setSelectedBrands([]);
    }
    
    if (preset.colors) {
      // Check if the colors exist in our availableColors array
      const validColors = preset.colors.filter(color => 
        availableColors.some(c => c.name === color)
      );
      setSelectedColors(validColors);
    } else {
      setSelectedColors([]);
    }
    
    if (preset.minPrice !== undefined) {
      setPriceMin(preset.minPrice);
    } else {
      setPriceMin(0);
    }
    
    if (preset.maxPrice !== undefined) {
      setPriceMax(preset.maxPrice);
    } else {
      setPriceMax(20000);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("all");
    setPriceMin(0);
    setPriceMax(20000);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSearchQuery("");
  };

  // Filter products by category, price, and search query
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(
        product => product.category === activeCategory
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(
      product => product.price >= priceMin && product.price <= priceMax
    );
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        product => selectedBrands.includes(product.brand)
      );
    }
    
    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(
        product => product.availableColors && product.availableColors.some(color => selectedColors.includes(color))
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        product => 
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) ||
          product.brand.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        // 'featured' sorting - no specific sort, use default order
        break;
    }
    
    return filtered;
  };

  // Get new arrivals for the top section
  const getNewArrivals = () => {
    return products.filter(product => product.isNewArrival).slice(0, 4);
  };

  // Add to cart handler
  const addToCart = async (product) => {
    try {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (isLoggedIn) {
        // Use CartService if logged in
        if (existingItem) {
          await CartService.updateItemQuantity(product.id, existingItem.quantity + 1);
        } else {
          await CartService.addToCart(product, 1);
        }
      }
      
      // Update local cart state and localStorage regardless of login status
      if (existingItem) {
        const updatedCart = cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        showNotification(`Increased quantity of ${product.title} in your cart`, "success", product);
      } else {
        const updatedCart = [...cart, { ...product, quantity: 1 }];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        showNotification(`${product.title} added to your cart`, "success", product);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification(`Failed to add ${product.title} to cart. Please try again.`, "error");
    }
  };

  // Open product details modal
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Render star ratings
  const renderStarRating = (rating) => {
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : i < Math.ceil(rating) && i >= Math.floor(rating) ? 'half-filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Format price with rupee symbol and thousand separators
  const formatPrice = (price) => {
    return `₹${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Get filtered products based on current filters
  const currentFilteredProducts = getFilteredProducts();

  // Add this useEffect for recently viewed products
  useEffect(() => {
    if (selectedProduct && !recentlyViewed.some(p => p.id === selectedProduct.id)) {
      setRecentlyViewed(prev => {
        const updated = [selectedProduct, ...prev].slice(0, 4);
        localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProduct]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const savedRecentlyViewed = localStorage.getItem("recentlyViewed");
    if (savedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(savedRecentlyViewed));
      } catch (error) {
        console.error("Error parsing recently viewed products", error);
      }
    }
  }, []);

  // Make sure the Bridal Wear Set uses the correct image - Try reimporting it
  useEffect(() => {
    // Fix image10 if it's not loading
    if (!products.find(p => p.id === 10)?.image) {
      console.warn("Bridal Wear image failed to load, attempting to fix...");
      
      // Create fallback image URL
      const fallbackImageUrl = "https://via.placeholder.com/400x600?text=Bridal+Wear";
      const img = new Image();
      img.src = fallbackImageUrl;
      
      img.onload = () => {
        // If fallback loads, update the bridal product image
        const updatedProducts = [...products];
        const bridalProduct = updatedProducts.find(p => p.id === 10);
        if (bridalProduct) {
          bridalProduct.image = fallbackImageUrl;
          console.log("Fallback image loaded for Bridal Wear");
        }
      };
    }
  }, [products]);

  // Add to wishlist handler
  const addToWishlist = async (product) => {
    try {
      const isInWishlist = wishlist.some(item => item.id === product.id);
      
      if (isInWishlist) {
        showNotification(`${product.title} is already in your wishlist`, "info", product);
        return;
      }
      
      if (isLoggedIn) {
        // Use CartService if logged in
        await CartService.addToWishlist(product);
      }
      
      // Update local wishlist state and localStorage regardless of login status
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      showNotification(`${product.title} added to your wishlist`, "success", product);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showNotification(`Failed to add ${product.title} to wishlist. Please try again.`, "error");
    }
  };

  return (
    <div className="shop-page">
      {/* Slideshow */}
      <div className="slideshow-container">
        <AnimatePresence mode="wait">
          {slideshowImages && slideshowImages.length > 0 && (
          <motion.div
            key={currentSlide}
            className="slide"
              style={{ backgroundImage: `url(${slideshowImages[currentSlide]?.url})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="slide-content">
              <motion.h2
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                  {slideshowImages[currentSlide]?.title}
              </motion.h2>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                  {slideshowImages[currentSlide]?.subtitle}
              </motion.p>
              <motion.button
                className="shop-now-btn"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                  {slideshowImages[currentSlide]?.buttonText}
              </motion.button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
        
        <div className="slide-indicators">
          {slideshowImages?.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Filter Bar - Mobile Toggle */}
      <div className="mobile-filter-toggle">
        <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
          <FaFilter /> {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {/* New Arrivals Section */}
      <section className="new-arrivals">
        <h2>New Arrivals</h2>
        <div className="new-arrivals-grid">
          {getNewArrivals().map(product => (
            <motion.div
              key={product.id}
              className="product-card new-arrival-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setShowQuickAdd(product.id)}
              onMouseLeave={() => setShowQuickAdd(null)}
            >
              <div className="product-image" onClick={() => openProductDetails(product)}>
                <img src={product.image} alt={product.title} />
                <div className="product-badge new-arrival">New</div>
                {showQuickAdd === product.id && (
                  <motion.div 
                    className="quick-view-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button className="quick-view-btn">Quick View</button>
                  </motion.div>
                )}
              </div>
              <div className="product-info">
                <h3 onClick={() => openProductDetails(product)}>{product.title}</h3>
                <div className="product-brand">{product.brand}</div>
                <div className="product-rating">
                  {renderStarRating(product.rating)}
                  <span>({product.rating.toFixed(1)})</span>
                </div>
                <div className="product-price">{formatPrice(product.price)}</div>
                <div className="product-card-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(product);
                    }}
                    aria-label="Add to wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <button className="view-all-btn" onClick={() => setActiveCategory('all')}>
          View All Products
        </button>
      </section>
      
      {/* Main Shop Section */}
      <div className="shop-main">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${isMobileFilterOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="sidebar-header">
            <h2>Filters</h2>
            <motion.button 
              className="clear-filters-btn"
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset All
            </motion.button>
            <button className="mobile-filter-close" onClick={() => setIsMobileFilterOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          {/* Filter Summary */}
          <div className="filter-summary">
            <button 
              className="filter-summary-toggle"
              onClick={() => setIsFilterSummaryOpen(!isFilterSummaryOpen)}
            >
              <span>Filter Summary</span>
              <span className={`arrow ${isFilterSummaryOpen ? 'up' : 'down'}`}>▼</span>
            </button>
            
            {isFilterSummaryOpen && (
              <motion.div 
                className="filter-summary-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="summary-item">
                  <span className="summary-label">Category:</span>
                  <span className="summary-value">{categories.find(cat => cat.id === activeCategory)?.name || 'All Products'}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Price Range:</span>
                  <span className="summary-value">₹{priceMin.toLocaleString()} - ₹{priceMax.toLocaleString()}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Brands:</span>
                  <span className="summary-value">{selectedBrands.length > 0 ? selectedBrands.join(', ') : 'All'}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Colors:</span>
                  <span className="summary-value">{selectedColors.length > 0 ? selectedColors.join(', ') : 'All'}</span>
                </div>
                
                <div className="active-filter-count">
                  {currentFilteredProducts.length} products match your filters
                </div>
              </motion.div>
            )}
          </div>

          {/* Popular Filters */}
          <div className="sidebar-section">
            <h3>Popular Filters</h3>
            <div className="popular-filters">
              {popularFilters.map((filter, index) => (
                <motion.button
                  key={index}
                  className="popular-filter-btn"
                  onClick={() => applyPresetFilter(filter)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {filter.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Categories */}
          <div className="sidebar-section">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    className={activeCategory === category.id ? 'active' : ''}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                    <span className="category-count">
                      {products.filter(p => category.id === 'all' ? true : p.category === category.id).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Price Range - Enhanced with dual sliders */}
          <div className="sidebar-section">
            <h3>Price Range</h3>
            <div className="price-range-control">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min</label>
                  <div className="price-input-wrapper">
                    <span className="rupee-symbol">₹</span>
                    <input
                      type="number"
                      min="0"
                      max={priceMax}
                      value={priceMin}
                      onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                      className="price-input"
                    />
                  </div>
                </div>
                <div className="price-input-group">
                  <label>Max</label>
                  <div className="price-input-wrapper">
                    <span className="rupee-symbol">₹</span>
                    <input
                      type="number"
                      min={priceMin}
                      max="20000"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                      className="price-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="slider-container">
                <div className="price-slider-track"></div>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 500))}
                  className="range-slider min-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 500))}
                  className="range-slider max-slider"
                />
              </div>
              
              <div className="range-labels">
                <span>₹0</span>
                <span>₹20,000</span>
              </div>
            </div>
          </div>
          
          {/* Color Filter */}
          <div className="sidebar-section">
            <h3>Colors</h3>
            <div className="color-filter">
              {availableColors.map(color => (
                <button
                  key={color.name}
                  className={`color-filter-btn ${selectedColors.includes(color.name) ? 'selected' : ''}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => toggleColorFilter(color.name)}
                  title={color.name}
                >
                  {selectedColors.includes(color.name) && <span className="color-check">✓</span>}
                </button>
              ))}
            </div>
            {selectedColors.length > 0 && (
              <div className="selected-colors">
                {selectedColors.map(color => (
                  <span key={color} className="selected-color-pill">
                    {color}
                    <button onClick={() => toggleColorFilter(color)}>×</button>
                  </span>
                ))}
                <button 
                  className="clear-colors"
                  onClick={() => setSelectedColors([])}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          {/* Brands */}
          <div className="sidebar-section">
            <h3>Brands</h3>
            <div className="brand-search">
              <input 
                type="text" 
                placeholder="Search brands..." 
                className="brand-search-input"
              />
            </div>
            <ul className="brand-list">
              {allBrands.map(brand => (
                <li key={brand}>
                  <label className="brand-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)} 
                      onChange={() => toggleBrandFilter(brand)} 
                    />
                    <span className="checkmark"></span>
                    {brand}
                    <span className="brand-count">
                      {products.filter(p => p.brand === brand).length}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Apply Filters Button (Mobile) */}
          <div className="apply-filters-mobile">
            <button 
              className="apply-filters-btn"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Show {currentFilteredProducts.length} Results
            </button>
          </div>
        </aside>
        
        {/* Products Container */}
        <div className="products-container">
          {/* Search and Sort Controls */}
          <div className="shop-controls">
            <div className="search-container">
              <button className="search-btn">
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="sort-container">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(activeCategory !== 'all' || selectedBrands.length > 0 || searchQuery) && (
            <div className="active-filters">
              <span>Active Filters:</span>
              {activeCategory !== 'all' && (
                <div className="filter-pill">
                  {categories.find(cat => cat.id === activeCategory).name}
                  <button onClick={() => setActiveCategory('all')}><FaTimes /></button>
                </div>
              )}
              {selectedBrands.map(brand => (
                <div key={brand} className="filter-pill">
                  {brand}
                  <button onClick={() => toggleBrandFilter(brand)}><FaTimes /></button>
                </div>
              ))}
              {searchQuery && (
                <div className="filter-pill">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}><FaTimes /></button>
                </div>
              )}
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            </div>
          )}

          {/* Results Count */}
          <div className="results-count">
            {currentFilteredProducts.length} {currentFilteredProducts.length === 1 ? 'product' : 'products'} found
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="loading-spinner">
              Loading products...
            </div>
          ) : currentFilteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {currentFilteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => setShowQuickAdd(product.id)}
                  onMouseLeave={() => setShowQuickAdd(null)}
                >
                  <div className="product-image" onClick={() => openProductDetails(product)}>
                    <img src={product.image} alt={product.title} />
                    {product.isNewArrival && (
                      <div className="product-badge new-arrival">New</div>
                    )}
                    {!product.isNewArrival && product.stock <= 3 && product.stock > 0 && (
                      <div className="product-badge low-stock">Low Stock</div>
                    )}
                    {product.stock === 0 && (
                      <div className="product-badge out-of-stock">Out of Stock</div>
                    )}
                    
                    {showQuickAdd === product.id && (
                      <motion.div 
                        className="quick-view-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <button className="quick-view-btn">Quick View</button>
                      </motion.div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 onClick={() => openProductDetails(product)}>{product.title}</h3>
                    <div className="product-brand">{product.brand}</div>
                    <div className="product-rating">
                      {renderStarRating(product.rating)}
                      <span>({product.rating.toFixed(1)})</span>
                    </div>
                    <div className="product-price">{formatPrice(product.price)}</div>
                    <div className="product-card-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button
                        className="save-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product);
                        }}
                        aria-label="Add to wishlist"
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Collection */}
      {!loading && currentFilteredProducts.length > 0 && (
        <>
          <section className="featured-collection">
            <h2>Featured Collection: Festive Elegance</h2>
            <p className="featured-description">Curated designs for the upcoming festive season</p>
            
            <div className="featured-grid">
              {products.filter(p => p.tags?.includes("festive")).slice(0, 3).map(product => (
                <motion.div
                  key={product.id}
                  className="featured-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="featured-image" onClick={() => openProductDetails(product)}>
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="featured-info">
                    <h3>{product.title}</h3>
                    <p>{product.description.substring(0, 60)}...</p>
                    <button 
                      className="view-details-btn"
                      onClick={() => openProductDetails(product)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Style Guide Section */}
          <section className="style-guide">
            <h2>Style Inspiration</h2>
            <div className="style-guide-content">
              <div className="style-guide-text">
                <h3>How to Style Your Ethnic Wear</h3>
                <p>Discover the perfect accessories to complement your ethnic outfits</p>
                <ul className="style-tips">
                  <li><span className="tip-highlight">Tip 1:</span> Pair your saree with statement jewelry for a grand look</li>
                  <li><span className="tip-highlight">Tip 2:</span> Match your dupatta with contrasting kurti colors</li>
                  <li><span className="tip-highlight">Tip 3:</span> Add a modern twist with fusion accessories</li>
                </ul>
                <button className="style-guide-btn">View Styling Guide</button>
              </div>
              <div className="style-guide-image">
                <img src={products.find(p => p.category === 'blouses')?.image || "https://via.placeholder.com/400x600?text=Style+Guide"} alt="Style Guide" />
              </div>
            </div>
          </section>

          {/* Customer Recommendations */}
          <section className="recommendations">
            <h2>Customers Also Viewed</h2>
            <div className="recommendations-grid">
              {[...products]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4)
                .map(product => (
                  <motion.div
                    key={product.id}
                    className="recommendation-card"
                    whileHover={{ y: -10 }}
                    onClick={() => openProductDetails(product)}
                  >
                    <div className="recommendation-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                    <div className="recommendation-info">
                      <h4>{product.title}</h4>
                      <div className="recommendation-price">{formatPrice(product.price)}</div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </section>
        </>
      )}
      
      {/* Product Detail Modal */}
      <AnimatePresence>
        {showModal && selectedProduct && (
          <motion.div 
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="product-modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
              
              <div className="product-modal-content">
                <div className="product-modal-image">
                  <img src={selectedProduct.image} alt={selectedProduct.title} />
                  {selectedProduct.isNewArrival && (
                    <div className="product-badge new-arrival">New</div>
                  )}
                </div>
                
                <div className="product-modal-details">
                  <h2>{selectedProduct.title}</h2>
                  <div className="product-modal-brand">{selectedProduct.brand}</div>
                  
                  <div className="product-modal-rating">
                    {renderStarRating(selectedProduct.rating)}
                    <span>({selectedProduct.rating.toFixed(1)})</span>
                  </div>
                  
                  <div className="product-modal-price">
                    <FaRupeeSign />
                    {selectedProduct.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  
                  <p className="product-modal-description">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="product-modal-info">
                    <div className="product-info-row">
                      <span className="info-label">Category:</span>
                      <span className="info-value">
                        {selectedProduct.category ? 
                          (categories.find(c => c.id === selectedProduct.category)?.name || selectedProduct.category) 
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="product-info-row">
                      <span className="info-label">Material:</span>
                      <span className="info-value">{selectedProduct.material || 'N/A'}</span>
                    </div>
                    
                    <div className="product-info-row">
                      <span className="info-label">Care:</span>
                      <span className="info-value">{selectedProduct.care}</span>
                    </div>
                    
                    <div className="product-info-row">
                      <span className="info-label">Available Colors:</span>
                      <div className="color-options">
                        {selectedProduct.availableColors && selectedProduct.availableColors.map(color => (
                          <div key={color} className="color-option" title={color}>
                            <span className={`color-swatch ${color.toLowerCase()}`}></span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="product-info-row">
                      <span className="info-label">Availability:</span>
                      {selectedProduct.stock > 0 ? (
                        <span className="info-value in-stock">In Stock ({selectedProduct.stock} items)</span>
                      ) : (
                        <span className="info-value out-of-stock">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="product-info-row shipping">
                      <span className="info-value">{selectedProduct.shipping}</span>
                    </div>
                  </div>
                  
                  <div className="product-modal-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setShowModal(false);
                      }}
                      disabled={selectedProduct.stock === 0}
                    >
                      Add to Cart
                    </button>
                    
                    <div className="secondary-actions">
                      <button 
                        className="action-btn"
                        onClick={() => addToWishlist(selectedProduct)}
                      >
                        <FaHeart /> Save
                      </button>
                      <button className="action-btn">
                        <FaShare /> Share
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-details-section">
                    <h3>Product Details</h3>
                    <p>{selectedProduct.details}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && !loading && (
        <section className="recently-viewed">
          <h2>Recently Viewed</h2>
          <div className="recently-viewed-grid">
            {recentlyViewed.map(product => (
              <motion.div
                key={product.id}
                className="recently-viewed-card"
                whileHover={{ y: -5 }}
                onClick={() => openProductDetails(product)}
              >
                <div className="recently-viewed-image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="recently-viewed-info">
                  <h4>{product.title}</h4>
                  <div className="recently-viewed-price">{formatPrice(product.price)}</div>
                  <button className="quick-view-again-btn">View Again</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      
      {/* Floating Cart Button */}
      <div className="floating-buttons">
        <a href="/cart" className="floating-btn cart-btn">
          <FaShoppingCart />
          {cart.length > 0 && <div className="badge">{cart.length}</div>}
        </a>
      </div>
      
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`notification-toast ${notification.type}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
          >
            <div className="notification-toast-content">
              {notification.type === 'success' ? (
                <div className="notification-icon-success">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              ) : notification.type === 'error' ? (
                <div className="notification-icon-error">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
              ) : (
                <div className="notification-icon-info">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v2h-2zm0 4h2v6h-2z" />
                  </svg>
                </div>
              )}
              
              {notification.product ? (
                <div className="notification-product">
                  <div className="notification-product-image">
                    <img src={notification.product.image} alt={notification.product.title} />
                  </div>
                  <div className="notification-message">
                    <p className="notification-text">{notification.message}</p>
                    <div className="notification-actions">
                      <a href="/cart" className="view-cart-btn">View Cart</a>
                      <button className="continue-btn" onClick={() => setNotification({...notification, show: false})}>
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="notification-message">
                  <p className="notification-text">{notification.message}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Back to Top Button */}
      <motion.button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </motion.button>
    </div>
  );
};

export default Shop;
