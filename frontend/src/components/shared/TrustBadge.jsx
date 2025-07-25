import React from 'react';
import { Shield, Award, Heart, Users } from 'lucide-react';

const TrustBadge = ({ type, icon, title, description, value }) => {
  const getIcon = () => {
    switch (type || icon) {
      case 'security':
        return <Shield className="w-8 h-8 text-green-600" />;
      case 'quality':
        return <Award className="w-8 h-8 text-blue-600" />;
      case 'impact':
        return <Heart className="w-8 h-8 text-red-600" />;
      case 'community':
        return <Users className="w-8 h-8 text-purple-600" />;
      default:
        return <Shield className="w-8 h-8 text-green-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type || icon) {
      case 'security':
        return 'bg-green-50 border-green-200';
      case 'quality':
        return 'bg-blue-50 border-blue-200';
      case 'impact':
        return 'bg-red-50 border-red-200';
      case 'community':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getBackgroundColor()} text-center hover:shadow-md transition-shadow duration-200`}>
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || 'Trust Badge'}
      </h3>
      
      {value && (
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {value}
        </div>
      )}
      
      <p className="text-sm text-gray-600">
        {description || 'Your trust is our priority'}
      </p>
    </div>
  );
};

export default TrustBadge;
