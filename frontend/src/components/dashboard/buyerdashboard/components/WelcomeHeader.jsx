import React from 'react';
import { User, Settings, Bell } from 'lucide-react';

const WelcomeHeader = ({ user }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {greeting}, {user.firstName}!
              </h1>
              <p className="text-rose-100 mt-1">
                Welcome back to your personal marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <button className="relative p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-gray-900 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings size={20} />
            </button>
            <button className="flex items-center space-x-2 bg-white text-rose-500 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <User size={18} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{user.stats.totalOrders}</div>
            <div className="text-rose-100 text-sm">Total Orders</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{user.stats.wishlistItems}</div>
            <div className="text-rose-100 text-sm">Wishlist Items</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{user.stats.rewardPoints}</div>
            <div className="text-rose-100 text-sm">Reward Points</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{user.stats.impactScore}</div>
            <div className="text-rose-100 text-sm">Impact Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;