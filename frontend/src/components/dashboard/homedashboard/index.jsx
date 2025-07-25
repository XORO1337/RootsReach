import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { 
  HeroSection, 
  FeaturedProducts, 
  MeetArtisans, 
  TestimonialsStats 
} from './components';

// Dummy data for homepage
const featuredProducts = [
  {
    id: 1,
    name: "Handwoven Silk Scarf",
    artisan: "Maria Santos",
    price: 89,
    originalPrice: 120,
    rating: 5,
    reviews: 24,
    image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    description: "Beautiful silk scarf with traditional patterns, handwoven by skilled artisan Maria.",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Ceramic Bowl Set",
    artisan: "Priya Sharma",
    price: 65,
    rating: 4,
    reviews: 18,
    image: "https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg",
    description: "Set of 4 handcrafted ceramic bowls with unique glazing techniques.",
    badge: "New"
  },
  {
    id: 3,
    name: "Embroidered Tote Bag",
    artisan: "Ana Rodriguez",
    price: 45,
    rating: 5,
    reviews: 32,
    image: "https://images.pexels.com/photos/7679447/pexels-photo-7679447.jpeg",
    description: "Eco-friendly canvas tote with intricate hand embroidery work."
  },
  {
    id: 4,
    name: "Silver Jewelry Set",
    artisan: "Fatima Al-Zahra",
    price: 150,
    rating: 5,
    reviews: 15,
    image: "https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg",
    description: "Handcrafted silver necklace and earring set with traditional motifs."
  }
];

const artisans = [
  {
    id: 1,
    name: "Maria Santos",
    location: "Guatemala",
    specialty: "Textile Weaving",
    story: "Maria has been weaving traditional patterns for over 20 years. She learned from her grandmother and now teaches other women in her community, preserving ancient techniques while supporting her family.",
    image: "https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg",
    featured: true,
    productCount: 15,
    rating: 4.9
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Rajasthan, India",
    specialty: "Ceramic Pottery",
    story: "Priya creates beautiful pottery using traditional Indian techniques. Her work supports her children's education and has become a source of pride for her village.",
    image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    productCount: 23,
    rating: 4.8
  },
  {
    id: 3,
    name: "Ana Rodriguez",
    location: "Peru",
    specialty: "Hand Embroidery",
    story: "Ana specializes in traditional Peruvian embroidery techniques passed down through generations. Her colorful designs tell stories of her Andean heritage.",
    image: "https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg",
    productCount: 18,
    rating: 5.0
  }
];

const testimonials = [
  {
    id: 1,
    content: "I love knowing that my purchase is making a real difference in someone's life. The quality is amazing and each piece has such a beautiful story.",
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    rating: 5
  },
  {
    id: 2,
    content: "The craftsmanship is incredible! You can feel the love and care that went into making each product. I'm a customer for life.",
    name: "Emma Chen",
    location: "Toronto, Canada",
    avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
    rating: 5
  },
  {
    id: 3,
    content: "RootsReach has connected me with the most beautiful handmade products. I feel good knowing I'm supporting women entrepreneurs.",
    name: "Lisa Williams",
    location: "London, UK",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    rating: 5
  }
];

const stats = [
  {
    id: 1,
    type: "impact",
    title: "Women Empowered",
    value: "500+",
    description: "Artisans supported worldwide"
  },
  {
    id: 2,
    type: "community",
    title: "Communities",
    value: "50+",
    description: "Villages and towns reached"
  },
  {
    id: 3,
    type: "quality",
    title: "Quality Products",
    value: "1000+",
    description: "Handcrafted with love"
  },
  {
    id: 4,
    type: "security",
    title: "Happy Customers",
    value: "10K+",
    description: "Satisfied buyers globally"
  }
];

const HomeDashboard = () => {
  const handleGetStarted = () => {
    console.log('Navigate to products page');
  };

  const handleWatchVideo = () => {
    console.log('Open video modal');
  };

  const handleLogin = () => {
    console.log('Navigate to login');
  };

  const handleSignup = () => {
    console.log('Navigate to signup');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        isLoggedIn={false}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
      />
      
      <main>
        <HeroSection 
          onGetStarted={handleGetStarted}
          onWatchVideo={handleWatchVideo}
        />
        
        <FeaturedProducts products={featuredProducts} />
        
        <MeetArtisans artisans={artisans} />
        
        <TestimonialsStats 
          testimonials={testimonials}
          stats={stats}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeDashboard;