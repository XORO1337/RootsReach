import React, { useState } from 'react';
import {
  ChefHat, Package, Leaf, Eye, EyeOff,
  Phone, Lock, User, Users, Heart, Sprout, ShoppingCart,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onToggleMode }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('artisan');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-send OTP when mobile number is 10 digits
    if (name === 'mobile' && value.length === 10) {
      handleSendOTP(value);
    }
  };

  const handleSendOTP = async (phoneNumber) => {
    try {
      setIsLoading(true);
      setOtpError('');
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: '+91' + phoneNumber }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
      } else {
        setOtpError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      setOtpError('');

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+91' + formData.mobile,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsPhoneVerified(true);
        setOtpError('');
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Basic validation for all fields
    const { name, mobile, otp, password, confirmPassword } = formData;
    if (!name || !mobile.match(/^[0-9]{10}$/) || !otp.match(/^[0-9]{6}$/) || !password || !confirmPassword) {
      alert('Please fill all fields correctly.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Connect to backend
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: mobile,
          password,
          role: selectedRole,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Signup successful!');
        // Navigate based on role
        if (selectedRole === 'artisan') {
          navigate('/artisan-dashboard');
        } else if (selectedRole === 'distributor') {
          navigate('/distributor-dashboard');
        } else if (selectedRole === 'buyer') {
          navigate('/buyer-dashboard');
        }
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl"></div>

      <div className="text-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Join Our Community</h2>
        <p className="text-gray-600 text-sm flex items-center justify-center space-x-1">
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          <span>Start making an impact</span>
          <Heart className="w-3.5 h-3.5 text-teal-500" />
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <form className="space-y-3.5 relative z-10" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Full name"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="relative mb-3">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Mobile number"
              pattern="[0-9]{10}"
              required
            />
            {formData.mobile.length === 10 && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4 animate-scale-check" />
            )}
          </div>
          {/* OTP */}
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
                  placeholder="Enter OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                {isPhoneVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-4 h-4 animate-scale-check" />
                )}
              </div>
              {otpSent && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || formData.otp.length !== 6}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isLoading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : formData.otp.length === 6
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              )}
            </div>
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white/90 text-sm"
              placeholder="Confirm password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Selector */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>I am a:</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
              onClick={() => setSelectedRole('artisan')}
              className={`p-2.5 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedRole === 'artisan'
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
        </form>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <Sprout className="w-4 h-4" />
            <span>Join Community</span>
            <Heart className="w-4 h-4" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </button>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already part of our community?
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
