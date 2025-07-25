import React from 'react';
import ArtisanCard from '../../shared/ArtisanCard';

const MeetArtisans = ({ artisans }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Our Artisans
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Behind every product is a talented woman with a story. 
            Meet the incredible artisans who create these beautiful handmade pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <ArtisanCard 
              key={artisan.id} 
              artisan={artisan} 
              showStats={false}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-rose-500 text-rose-500 px-8 py-3 rounded-lg hover:bg-rose-500 hover:text-white transition-colors duration-200 font-medium">
            Meet All Artisans
          </button>
        </div>
      </div>
    </section>
  );
};

export default MeetArtisans;