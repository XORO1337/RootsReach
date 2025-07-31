const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const otpService = require('../services/otpService');
const passport = require('../config/passport');

class AuthController {
  // Register with phone number
  static async registerWithPhone(req, res) {
    try {
      const { name, phone, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }

      // Create user
      const user = new User({
        name,
        phone,
        password,
        role: role || 'customer',
        authProvider: 'local'
      });

      await user.save();

      // Send OTP for phone verification
      try {
        await otpService.sendOTP(phone);
      } catch (otpError) {
        console.error('OTP sending failed:', otpError);
        // Continue with registration even if OTP fails
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your phone number.',
        data: {
          userId: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login with phone number or email
  static async login(req, res) {
    try {
      const { phone, email, password } = req.body;

      // Find user by phone or email
      const query = phone ? { phone } : { email };
      const user = await User.findOne(query);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user._id, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id });

      // Store refresh token
      user.refreshTokens.push({ token: refreshToken });
      user.lastLogin = new Date();
      await user.save();

      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict'
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            isIdentityVerified: user.isIdentityVerified
          },
          accessToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Google OAuth login initiation
  static initiateGoogleAuth(req, res, next) {
    // Store the selected role in session if provided
    const { role } = req.query;
    if (role) {
      req.session.selectedRole = role;
    }
    
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  }

  // Google OAuth callback
  static async handleGoogleCallback(req, res, next) {
    passport.authenticate('google', { session: false }, async (err, user) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=oauth_failed`);
      }

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=oauth_denied`);
      }

      try {
        // Check if role was pre-selected during OAuth initiation
        const selectedRole = req.session?.selectedRole || 'customer';
        console.log('🎯 OAuth Callback - Selected Role:', selectedRole);
        console.log('🎯 OAuth Callback - User is new:', user._isNewUser);
        console.log('🎯 OAuth Callback - Current user role:', user.role);
        
        // Update user role if it was selected (for both new and existing users)
        if (selectedRole && selectedRole !== 'customer') {
          console.log('🔄 Updating user role from', user.role, 'to', selectedRole);
          user.role = selectedRole;
          await user.save();
        }

        // Generate tokens with enhanced payload
        const accessToken = generateAccessToken({ 
          userId: user._id, 
          role: user.role,
          sessionId: Date.now().toString() // Include session identifier
        });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // Store refresh token with metadata
        user.refreshTokens.push({ 
          token: refreshToken,
          createdAt: new Date(),
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
        user.lastLogin = new Date();
        await user.save();

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict'
        });

        // Redirect to frontend OAuth callback with token and user data
        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          authProvider: user.authProvider
        };

        console.log('🎯 Final user data being sent to frontend:', userData);
        console.log('🎯 User role before redirect:', userData.role);
        
        const callbackUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userData))}`;
        console.log('🔗 Redirecting to:', callbackUrl);
        res.redirect(callbackUrl);

      } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=oauth_failed`);
      }
    })(req, res, next);
  }

  // Send OTP for phone verification (Enhanced MongoDB-based)
  static async sendOTP(req, res) {
    try {
      const { phone } = req.body;

      // Check if user exists
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please register first.'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }

      const result = await otpService.sendOTP(phone);

      res.json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
          sendCount: result.sendCount,
          maxSendsPerDay: result.maxSendsPerDay,
          otpCode: result.otpCode // Only in development
        }
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  }

  // Resend OTP for phone verification (Enhanced with better tracking)
  static async resendOTP(req, res) {
    try {
      const { phone } = req.body;

      // Check if user exists
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please register first.'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }

      const result = await otpService.resendOTP(phone);

      res.json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
          attemptsRemaining: result.attemptsRemaining,
          dailySendCount: result.dailySendCount,
          maxSendsPerDay: result.maxSendsPerDay,
          otpCode: result.otpCode // Only in development
        }
      });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(429).json({
        success: false,
        message: error.message || 'Failed to resend OTP'
      });
    }
  }

  // Get comprehensive OTP status (Enhanced)
  static async getOTPStatus(req, res) {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      const status = await otpService.getOTPStatus(phone);

      if (!status.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found with this phone number'
        });
      }

      res.json({
        success: true,
        message: 'OTP status retrieved successfully',
        data: status
      });

    } catch (error) {
      console.error('Get OTP status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get OTP status'
      });
    }
  }

  // Verify OTP
  static async verifyOTP(req, res) {
    try {
      const { phone, otp } = req.body;

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }

      const verification = await otpService.verifyOTP(phone, otp);

      if (verification.success) {
        res.json({
          success: true,
          message: verification.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: verification.message,
          attemptsRemaining: verification.attemptsRemaining
        });
      }

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'OTP verification failed'
      });
    }
  }

  // Refresh access token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not provided'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokens.find(token => token.token === refreshToken)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userId = req.user?.id;

      if (userId && refreshToken) {
        // Remove refresh token from database
        await User.findByIdAndUpdate(userId, {
          $pull: { refreshTokens: { token: refreshToken } }
        });
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Logout from all devices
  static async logoutAll(req, res) {
    try {
      const userId = req.user.id;

      // Clear all refresh tokens
      await User.findByIdAndUpdate(userId, {
        refreshTokens: []
      });

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });

    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isIdentityVerified: user.isIdentityVerified,
          verificationDocuments: user.verificationDocuments,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Clear all refresh tokens to force re-login
      user.refreshTokens = [];
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
}

module.exports = AuthController;
