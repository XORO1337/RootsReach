import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import ProductModal from '../components/ProductModal';
import SellerModal from '../components/SellerModal';
import Footer from '../components/Footer';
import { products } from '../data/mockData';
import { Product, CartItem, FilterState } from '../types';

const Marketplace: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    location: '',
    priceRange: [0, 5000],
    craftType: '',
    search: ''
  });

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: product.minOrder }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleViewSeller = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setIsSellerModalOpen(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
    // Scroll to products section
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Artisan Dashboard Link */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          to="/artisan"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg flex items-center space-x-2"
        >
          <span>🎨</span>
          <span>Artisan Dashboard</span>
        </Link>
      </div>
      
      <Header
        cartItemsCount={cartItemsCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <Hero />
      
      <Categories onCategorySelect={handleCategorySelect} />
      
      <ProductGrid
        products={products}
        filters={filters}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
        onViewSeller={handleViewSeller}
      />
      
      <Footer />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onViewSeller={handleViewSeller}
      />
      
      <SellerModal
        sellerId={selectedSellerId}
        isOpen={isSellerModalOpen}
        onClose={() => {
          setIsSellerModalOpen(false);
          setSelectedSellerId(null);
        }}
      />
    </div>
  );
};

export default Marketplace;
