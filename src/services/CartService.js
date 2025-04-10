import axios from 'axios';

const API_URL = 'http://localhost:5000';
// Set timeout for network requests
const TIMEOUT_MS = 10000;

// Create a custom axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth header
api.interceptors.request.use(
  config => {
    // Add auth header before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for standard error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle response errors
    let errorMessage = 'An unexpected error occurred';
    
    if (!navigator.onLine) {
      errorMessage = 'You are currently offline. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.message || 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          // Could add auto logout here
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = error.response.data.message || `Error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'No response from server. Please try again later.';
    }
    
    // Store error message for use in components
    error.userMessage = errorMessage;
    console.error(`API Error: ${errorMessage}`, error);
    
    return Promise.reject(error);
  }
);

// Check if user is online
const isOnline = () => navigator.onLine;

// Validate cart item data
const validateCartItem = (item) => {
  const required = ['productId', 'name', 'price', 'quantity'];
  return required.every(prop => item && item[prop] !== undefined);
};

const CartService = {
  // Get cart from database with fallback to localStorage
  getCart: async () => {
    try {
      if (!isOnline() || !localStorage.getItem('token')) {
        // Get from localStorage when offline or not logged in
        const savedCart = localStorage.getItem('cart');
        return savedCart ? { items: JSON.parse(savedCart) } : { items: [] };
      }
      
      const response = await api.get('/cart');
      
      // Keep localStorage in sync
      if (response.data.cart && response.data.cart.items) {
        localStorage.setItem('cart', JSON.stringify(response.data.cart.items));
      }
      
      return response.data.cart;
    } catch (error) {
      // Fallback to localStorage on error
      console.error('Error fetching cart:', error.userMessage || error.message);
      const savedCart = localStorage.getItem('cart');
      return savedCart ? { items: JSON.parse(savedCart) } : { items: [] };
    }
  },

  // Update entire cart with sync
  updateCart: async (items) => {
    try {
      // Always update localStorage
      localStorage.setItem('cart', JSON.stringify(items));
      
      if (!isOnline() || !localStorage.getItem('token')) {
        return { items };
      }
      
      const response = await api.put('/cart', { items });
      return response.data.cart;
    } catch (error) {
      console.error('Error updating cart:', error.userMessage || error.message);
      return { items };
    }
  },

  // Add item to cart with validation
  addToCart: async (product, quantity = 1) => {
    try {
      if (!product || !product.id) {
        throw new Error('Invalid product data');
      }
      
      // Handle offline case - update localStorage directly
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedCart = localStorage.getItem('cart');
        const currentCart = savedCart ? JSON.parse(savedCart) : [];
        
        const existingItemIndex = currentCart.findIndex(item => 
          item.id === product.id || item.productId === product.id
        );
        
        if (existingItemIndex > -1) {
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          const newItem = {
            ...product,
            productId: product.id,
            quantity
          };
          currentCart.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(currentCart));
        return { items: currentCart };
      }
      
      const response = await api.post('/cart/add', { product, quantity });
      
      // Keep localStorage in sync
      if (response.data.cart && response.data.cart.items) {
        localStorage.setItem('cart', JSON.stringify(response.data.cart.items));
      }
      
      return response.data.cart;
    } catch (error) {
      console.error('Error adding to cart:', error.userMessage || error.message);
      return null;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      // Handle offline case
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedCart = localStorage.getItem('cart');
        const currentCart = savedCart ? JSON.parse(savedCart) : [];
        
        const updatedCart = currentCart.filter(item => 
          item.id !== productId && item.productId !== productId
        );
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { items: updatedCart };
      }
      
      const response = await api.delete(`/cart/item/${productId}`);
      
      // Keep localStorage in sync
      if (response.data.cart && response.data.cart.items) {
        localStorage.setItem('cart', JSON.stringify(response.data.cart.items));
      }
      
      return response.data.cart;
    } catch (error) {
      console.error('Error removing from cart:', error.userMessage || error.message);
      return null;
    }
  },

  // Update item quantity with validation
  updateItemQuantity: async (productId, quantity) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      
      // Handle offline case
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedCart = localStorage.getItem('cart');
        const currentCart = savedCart ? JSON.parse(savedCart) : [];
        
        const updatedCart = currentCart.map(item => 
          (item.id === productId || item.productId === productId) 
            ? { ...item, quantity } 
            : item
        );
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { items: updatedCart };
      }
      
      const response = await api.put(`/cart/item/${productId}`, { quantity });
      
      // Keep localStorage in sync
      if (response.data.cart && response.data.cart.items) {
        localStorage.setItem('cart', JSON.stringify(response.data.cart.items));
      }
      
      return response.data.cart;
    } catch (error) {
      console.error('Error updating quantity:', error.userMessage || error.message);
      return null;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      // Always clear localStorage
      localStorage.setItem('cart', JSON.stringify([]));
      
      if (!isOnline() || !localStorage.getItem('token')) {
        return { message: 'Cart cleared locally' };
      }
      
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error.userMessage || error.message);
      return { message: 'Cart cleared locally' };
    }
  },

  // Synchronize cart with server when coming back online
  synchronizeCart: async () => {
    try {
      if (!isOnline() || !localStorage.getItem('token')) {
        return false;
      }
      
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        await api.put('/cart', { items });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error synchronizing cart:', error.userMessage || error.message);
      return false;
    }
  },

  // Get wishlist with fallback to localStorage
  getWishlist: async () => {
    try {
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? { items: JSON.parse(savedWishlist) } : { items: [] };
      }
      
      const response = await api.get('/wishlist');
      
      // Keep localStorage in sync
      if (response.data.wishlist && response.data.wishlist.items) {
        localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist.items));
      }
      
      return response.data.wishlist;
    } catch (error) {
      console.error('Error fetching wishlist:', error.userMessage || error.message);
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? { items: JSON.parse(savedWishlist) } : { items: [] };
    }
  },

  // Add to wishlist with offline support
  addToWishlist: async (product) => {
    try {
      if (!product || !product.id) {
        throw new Error('Invalid product data');
      }
      
      // Handle offline case
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedWishlist = localStorage.getItem('wishlist');
        const currentWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
        
        const existingItemIndex = currentWishlist.findIndex(item => 
          item.id === product.id || item.productId === product.id
        );
        
        if (existingItemIndex === -1) {
          const newItem = {
            ...product,
            productId: product.id
          };
          currentWishlist.push(newItem);
          localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
        }
        
        return { items: currentWishlist };
      }
      
      const response = await api.post('/wishlist/add', { product });
      
      // Keep localStorage in sync
      if (response.data.wishlist && response.data.wishlist.items) {
        localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist.items));
      }
      
      return response.data.wishlist;
    } catch (error) {
      console.error('Error adding to wishlist:', error.userMessage || error.message);
      return null;
    }
  },

  // Remove from wishlist with offline support
  removeFromWishlist: async (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      // Handle offline case
      if (!isOnline() || !localStorage.getItem('token')) {
        const savedWishlist = localStorage.getItem('wishlist');
        const currentWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
        
        const updatedWishlist = currentWishlist.filter(item => 
          item.id !== productId && item.productId !== productId
        );
        
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        return { items: updatedWishlist };
      }
      
      const response = await api.delete(`/wishlist/item/${productId}`);
      
      // Keep localStorage in sync
      if (response.data.wishlist && response.data.wishlist.items) {
        localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist.items));
      }
      
      return response.data.wishlist;
    } catch (error) {
      console.error('Error removing from wishlist:', error.userMessage || error.message);
      return null;
    }
  },

  // Clear wishlist with offline support
  clearWishlist: async () => {
    try {
      // Always clear localStorage
      localStorage.setItem('wishlist', JSON.stringify([]));
      
      if (!isOnline() || !localStorage.getItem('token')) {
        return { message: 'Wishlist cleared locally' };
      }
      
      const response = await api.delete('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error.userMessage || error.message);
      return { message: 'Wishlist cleared locally' };
    }
  },
  
  // Synchronize wishlist with server when coming back online
  synchronizeWishlist: async () => {
    try {
      if (!isOnline() || !localStorage.getItem('token')) {
        return false;
      }
      
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const items = JSON.parse(savedWishlist);
        await api.put('/wishlist', { items });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error synchronizing wishlist:', error.userMessage || error.message);
      return false;
    }
  }
};

export default CartService; 