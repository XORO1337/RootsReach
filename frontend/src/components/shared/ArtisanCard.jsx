import React from 'react';

const ArtisanCard = ({ artisan }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={artisan.image || '/api/placeholder/300/250'} 
          alt={artisan.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {artisan.status || 'Active'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {artisan.name}
        </h3>
        
        <p className="text-gray-600 mb-3">
          {artisan.craft || 'Handcraft Specialist'}
        </p>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {artisan.description || 'Passionate artisan creating beautiful handmade products with traditional techniques.'}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{artisan.experience || '5+'}</span> years experience
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({artisan.rating || '4.8'})
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Products Made:</span>
            <span className="font-semibold text-gray-900">
              {artisan.productsCount || '150+'}
            </span>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;
