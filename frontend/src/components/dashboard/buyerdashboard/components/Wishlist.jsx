import React, { useState } from 'react';
import ProductCard from '../../../shared/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = ({ wishlistItems, onRemoveFromWishlist, onAddToCart }) => {
  const [wishlist, setWishlist] = useState(wishlistItems.map(item => item.id));

  const handleToggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      onRemoveFromWishlist?.(productId);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-4">Save items you love to view them later</p>
        <button className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            My Wishlist ({wishlistItems.length})
          </h2>
          <button className="text-rose-600 hover:text-rose-700 font-medium">
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              onAddToCart={onAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;