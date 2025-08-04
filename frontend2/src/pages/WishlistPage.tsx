import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package, Star, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { Product, FilterState } from '../types';
import { useWishlist, WishlistItem } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatWeightUnit } from '../utils/formatters';

const WishlistPage: React.FC = () => {
  const { wishlist, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const { cartItems, addToCart, updateQuantity, removeItem, getCartItemsCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Default filter state for header
  const [filters] = useState<FilterState>({
    category: '',
    location: '',
    priceRange: [0, 5000],
    craftType: '',
    search: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  // Convert wishlist item to Product type for cart
  const convertWishlistItemToProduct = (item: WishlistItem): Product => {
    const productImage = item.productId.images && item.productId.images.length > 0 
      ? item.productId.images[0] 
      : '/api/placeholder/300/300';

    const artisan = item.productId.artisanId || {
      _id: 'default-artisan',
      name: 'RootsReach Artisan',
      email: '',
      phone: '',
      city: 'India',
      state: 'Various'
    };

    return {
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      weightUnit: item.productId.weightUnit || 'g',
      image: productImage,
      category: item.productId.category,
      description: item.productId.description,
      materials: [],
      craftType: item.productId.category,
      rating: 4.5,
      reviews: 12,
      inStock: item.productId.stock > 0,
      minOrder: 1,
      seller: {
        id: artisan._id,
        name: artisan.name,
        city: artisan.city || 'Unknown',
        state: artisan.state || 'Unknown',
        avatar: '/api/placeholder/60/60',
        story: '',
        specialties: [item.productId.category],
        rating: 4.5,
        totalProducts: 0,
        yearsOfExperience: 5
      }
    };
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      const product = convertWishlistItemToProduct(item);
      addToCart(product);
      toast.success(`${item.productId.name} added to cart!`, {
        icon: '🛒',
        duration: 2000
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (!wishlist || wishlist.items.length === 0) {
      return;
    }

    if (window.confirm(`Are you sure you want to remove all ${wishlist.items.length} items from your wishlist?`)) {
      setIsClearing(true);
      try {
        await clearWishlist();
        toast.success('Wishlist cleared successfully');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast.error('Failed to clear wishlist');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const cartItemsCount = getCartItemsCount();

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        filters={filters}
        onFiltersChange={() => {}}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span>My Wishlist</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {isLoading ? 'Loading...' : `${wishlist?.totalItems || 0} items saved for later`}
              </p>
            </div>
            
            {wishlist && wishlist.items.length > 0 && (
              <button
                onClick={handleClearWishlist}
                disabled={isClearing}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isClearing ? 'Clearing...' : 'Clear All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!wishlist || wishlist.items.length === 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">
              Save items you love to your wishlist. They'll appear here so you can easily find them later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {!isLoading && wishlist && wishlist.items.length > 0 && (
          <div className="space-y-4">
            {wishlist.items
              .filter(item => item && item.productId) // Filter out any items with missing data
              .map((item) => (
              <div
                key={item.productId._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={item.productId.images?.[0] || '/api/placeholder/300/300'}
                      alt={item.productId.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                    {(item.productId.stock || 0) === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        {/* Category */}
                        <span className="inline-block text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium mb-2">
                          {item.productId.category}
                        </span>
                        
                        {/* Product Name */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.productId.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.productId.description}
                        </p>

                        {/* Seller Info */}
                        <div className="flex items-center mb-3">
                          <img
                            src="/api/placeholder/40/40"
                            alt={item.productId.artisanId?.name || 'Artisan'}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            by {item.productId.artisanId?.name || 'RootsReach Artisan'}
                          </span>
                          <div className="flex items-center text-xs text-gray-500 ml-4">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.productId.artisanId?.city || 'India'}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            4.5 (12 reviews)
                          </span>
                        </div>

                        {/* Added Date */}
                        <p className="text-xs text-gray-500">
                          Added on {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right ml-6">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{(item.productId.price || 0).toLocaleString()}/
                            <span className="text-sm text-gray-600">{formatWeightUnit(item.productId.weightUnit || 'unit')}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Stock: {item.productId.stock || 0} available
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={(item.productId.stock || 0) === 0}
                            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.productId._id)}
                            className="w-full border-2 border-red-300 text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default WishlistPage;
