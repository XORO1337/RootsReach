import React, { useState } from 'react';
import { ChefHat, Package, Leaf, Eye, EyeOff, Phone, Lock, Users, Heart, Sprout, ShoppingCart, Check } from 'lucide-react';

const Login = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('artisian');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { ...formData, role: selectedRole, rememberMe });
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl"></div>
      
      <div className="text-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>Continue your journey</span>
          <Leaf className="w-3.5 h-3.5 text-teal-500" />
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          <div>
            <div className="relative mb-3">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 text-sm"
                placeholder="Mobile number"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 text-sm"
                placeholder="Enter OTP"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 text-sm"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
           <label className="block text-xs font-medium text-gray-700 mb-2">
  <div className="flex items-center space-x-1">
    <Users className="w-3 h-3 text-emerald-600" />
    <span>I am a:</span>
  </div>
</label>


            <div className="grid grid-cols-3 gap-2">
              {/* Artisian Button */}
              <button
                type="button"
                onClick={() => setSelectedRole('artisian')}
                className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === 'artisian'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
              >
                <ChefHat className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Artisian</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('distributor')}
                className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === 'distributor'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
              >
                <Package className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Distributor</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === 'buyer'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white/70 hover:bg-white/90'
                }`}
              >
                <ShoppingCart className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-medium">Buyer</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  rememberMe 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {rememberMe && <Check className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />}
                </div>
              </div>
              <span className="ml-2 text-gray-600 text-xs">Remember me</span>
            </label>
            <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Continue Journey</span>
            <Leaf className="w-4 h-4" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </button>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Ready to join our community?
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
