import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Palette, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { buildApiUrl, buildGoogleOAuthUrl, API_CONFIG } from '../../config/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'artisan' | 'distributor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://cautious-zebra-x5549r5475j6f979-5174.app.github.dev'
        },
        credentials: 'include', // Include cookies for JWT
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('🔍 Login Debug - Backend response:', data);
        console.log('🔍 Login Debug - User role from backend:', data.data.user.role);
        
        // Use the auth context to manage user state
        const userData = {
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
          isEmailVerified: data.data.user.isEmailVerified,
          isPhoneVerified: data.data.user.isPhoneVerified,
          isIdentityVerified: data.data.user.isIdentityVerified
        };
        
        console.log('🔍 Login Debug - UserData object created:', userData);
        console.log('🔍 Login Debug - About to redirect based on role:', userData.role);
        
        login(userData, data.data.accessToken);
        
        // Redirect rules:
        // - Customer (or any unknown/default): go to marketplace root '/'
        // - Artisan: '/artisan'
        // - Distributor: '/distributor'
        const role = data.data.user.role;
        if (role === 'artisan') {
          console.log('🔍 Login Debug - Redirecting to /artisan');
          navigate('/artisan');
        } else if (role === 'distributor') {
          console.log('🔍 Login Debug - Redirecting to /distributor');
          navigate('/distributor');
        } else {
          console.log('🔍 Login Debug - Redirecting to / (customer or default)');
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Store selected role in sessionStorage and redirect to Google OAuth
    sessionStorage.setItem('selectedRole', formData.role);
    window.location.href = buildGoogleOAuthUrl(formData.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      <div className="absolute bottom-1/4 left-20 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-pulse delay-700"></div>
      
      {/* Decorative craft icons */}
      <div className="absolute top-20 right-1/4 text-orange-200 opacity-30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/4 text-yellow-300 opacity-30">
        <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        </svg>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              For Google Sign-In, I want to join as:
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Note: This selection only applies to Google OAuth. For email login, your existing account role will be used.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {/* Customer Role */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.role === 'customer'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className={`h-5 w-5 ${formData.role === 'customer' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium text-gray-900">Customer</div>
                    <div className="text-sm text-gray-500">Browse and purchase handmade crafts</div>
                  </div>
                </div>
              </button>

              {/* Artisan Role */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'artisan' }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.role === 'artisan'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Palette className={`h-5 w-5 ${formData.role === 'artisan' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium text-gray-900">Artisan</div>
                    <div className="text-sm text-gray-500">Sell your handmade crafts and manage orders</div>
                  </div>
                </div>
              </button>

              {/* Distributor Role */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'distributor' }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.role === 'distributor'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className={`h-5 w-5 ${formData.role === 'distributor' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium text-gray-900">Distributor</div>
                    <div className="text-sm text-gray-500">Manage inventory and distribute products</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
