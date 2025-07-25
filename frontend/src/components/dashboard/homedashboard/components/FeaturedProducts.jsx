import React from 'react';
import ProductCard from '../../../shared/ProductCard';

const FeaturedProducts = ({ products }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated collection of handcrafted products, 
            each telling a unique story of craftsmanship and empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showActions={false}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors duration-200 font-medium">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;