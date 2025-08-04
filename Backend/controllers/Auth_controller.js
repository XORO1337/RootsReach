const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const otpService = require('../services/otpService');
const passport = require('../config/passport');

class AuthController {
  // Register with phone number or email
  static async registerWithPhone(req, res) {
    try {
      const { name, phone, email, password, role, bio, region, skills, businessName, licenseNumber, distributionAreas } = req.body;

      // Validate required fields
      if (!name || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Name, password and role are required'
        });
      }

      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: 'Either email or phone number is required'
        });
      }

      // Check if user already exists (by phone or email)
      let existingUser;
      if (phone) {
        existingUser = await User.findOne({ phone });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number already exists'
          });
        }
      }
      
      if (email) {
        existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
          });
        }
      }

      // Create user data object
      const userData = {
        name,
        password,
        role: role || 'customer',
        authProvider: 'local'
      };

      // Add phone or email
      if (phone) userData.phone = phone;
      if (email) userData.email = email;

      // Create user
      const user = new User(userData);
      await user.save();

      // Create role-specific profile
      await AuthController.createRoleSpecificProfile(user._id, role, {
        bio,
        region,
        skills,
        businessName,
        licenseNumber,
        distributionAreas
      });

      // Send OTP for phone verification if phone is provided
      if (phone) {
        try {
          await otpService.sendOTP(phone);
        } catch (otpError) {
          console.error('OTP sending failed:', otpError);
          // Continue with registration even if OTP fails
        }
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

      res.status(201).json({
        success: true,
        message: phone ? 
          'User registered successfully. Please verify your phone number.' : 
          'User registered successfully.',
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          accessToken,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified
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
      const { phone, email, password, role } = req.body;

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

      // Handle role change if requested
      let roleChanged = false;
      if (role && role !== user.role && ['customer', 'artisan', 'distributor'].includes(role)) {
        console.log(`🔄 Role change requested: ${user.role} -> ${role} for user ${user.email}`);
        
        // Update user role
        const oldRole = user.role;
        user.role = role;
        roleChanged = true;

        // Create role-specific profile if changing to artisan or distributor
        if (role === 'artisan' || role === 'distributor') {
          try {
            await AuthController.createRoleSpecificProfile(user._id, role, {});
            console.log(`✅ Created ${role} profile for user ${user.email}`);
          } catch (error) {
            console.log(`ℹ️ Profile creation skipped - may already exist for user ${user.email}`);
          }
        }

        console.log(`✅ Role changed from ${oldRole} to ${role} for user ${user.email}`);
      }

      // Generate tokens with the current (possibly updated) role
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
        message: roleChanged ? `Login successful - Role updated to ${user.role}` : 'Login successful',
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
          accessToken,
          roleChanged
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
    console.log('🎯 OAuth Initiation - Role received from query:', role);
    
    if (role && ['customer', 'artisan', 'distributor'].includes(role)) {
      req.session.selectedRole = role;
      console.log('🎯 OAuth Initiation - Role stored in session:', req.session.selectedRole);
    } else {
      req.session.selectedRole = 'customer'; // Default fallback
      console.log('🎯 OAuth Initiation - Using default role: customer');
    }
    
    // Also include role in state parameter as fallback
    const state = JSON.stringify({ role: req.session.selectedRole });
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: state
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
        let selectedRole = req.session?.selectedRole || 'customer';
        
        // Also check state parameter as fallback
        if (req.query.state) {
          try {
            const stateData = JSON.parse(req.query.state);
            if (stateData.role) {
              selectedRole = stateData.role;
              console.log('🎯 OAuth Callback - Role found in state parameter:', selectedRole);
            }
          } catch (e) {
            console.log('🎯 OAuth Callback - Could not parse state parameter');
          }
        }
        
        console.log('🎯 OAuth Callback - Selected Role from session:', req.session?.selectedRole);
        console.log('🎯 OAuth Callback - Final selected role:', selectedRole);
        console.log('🎯 OAuth Callback - Session object:', req.session);
        console.log('🎯 OAuth Callback - User is new:', user._isNewUser);
        console.log('🎯 OAuth Callback - Current user role:', user.role);
        console.log('🎯 OAuth Callback - Query params:', req.query);
        
        // Always try to create/verify role-specific profile
        if (selectedRole === 'artisan' || selectedRole === 'distributor') {
          try {
            const defaultProfileData = {
              region: 'Default Region', // Provide a default region for artisans
              skills: [], // Empty skills array for artisans
              businessName: 'New Business', // Provide a default business name for distributors
              licenseNumber: '',
              distributionAreas: []
            };
            await AuthController.createRoleSpecificProfile(user._id, selectedRole, defaultProfileData);
          } catch (profileErr) {
            console.error('Failed to create role-specific profile:', profileErr);
            console.error('Profile error details:', profileErr.message);
            return res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=profile_creation_failed`);
          }
        }
        
        // Update user role if it was selected (for both new and existing users)
        console.log('🔄 About to update user role. Selected:', selectedRole, 'Current:', user.role);
        if (selectedRole && ['customer', 'artisan', 'distributor'].includes(selectedRole)) {
          if (user.role !== selectedRole) {
            console.log('🔄 Updating user role from', user.role, 'to', selectedRole);
            user.role = selectedRole;
            
            // Mark as modified to ensure save
            user.markModified('role');
            await user.save();
            
            console.log('✅ User role updated successfully. New role:', user.role);
            
            // Create role-specific profile for new users with non-customer roles
            if (user._isNewUser && (selectedRole === 'artisan' || selectedRole === 'distributor')) {
              try {
                const defaultProfileData = {
                  region: 'Default Region',
                  skills: [],
                  businessName: 'New Business', // Provide default business name for distributors
                  licenseNumber: '',
                  distributionAreas: []
                };
                await AuthController.createRoleSpecificProfile(user._id, selectedRole, defaultProfileData);
                console.log('✅ Role-specific profile created for new user');
              } catch (profileErr) {
                console.error('❌ Failed to create role-specific profile:', profileErr);
              }
            }
          } else {
            console.log('ℹ️ User role already matches selected role:', selectedRole);
          }
        } else {
          console.log('⚠️ Invalid or missing selected role, keeping current role:', user.role);
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

        // Fetch fresh user data from database to ensure we have the latest role
        const freshUser = await User.findById(user._id);
        console.log('🔍 Fresh user data from DB - Role:', freshUser.role);

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict'
        });

        // Redirect to frontend OAuth callback with token and user data
        const userData = {
          id: freshUser._id,
          name: freshUser.name,
          email: freshUser.email,
          role: freshUser.role,
          isEmailVerified: freshUser.isEmailVerified,
          isPhoneVerified: freshUser.isPhoneVerified,
          authProvider: freshUser.authProvider
        };

        console.log('🎯 Final user data being sent to frontend:', userData);
        console.log('🎯 User role before redirect:', userData.role);
        
        const callbackUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userData))}&role=${freshUser.role}`;
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

  // Register with email and role-specific data
  static async registerWithEmail(req, res) {
    try {
      console.log('📝 Registration request received:', {
        body: req.body,
        headers: req.headers
      });
      
      const { name, email, password, phoneNumber, role, bio, region, skills, businessName, licenseNumber, distributionAreas } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: email },
          ...(phoneNumber ? [{ phone: phoneNumber }] : [])
        ]
      });
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
          });
        }
        if (existingUser.phone === phoneNumber) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number already exists'
          });
        }
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone: phoneNumber, // Map phoneNumber to phone
        role: role || 'customer',
        authProvider: 'local',
        isEmailVerified: false,
        isPhoneVerified: false
      });

      await user.save();

      // Create role-specific profile
      await AuthController.createRoleSpecificProfile(user._id, role, {
        bio,
        region,
        skills,
        businessName,
        licenseNumber,
        distributionAreas
      });

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

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          accessToken,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        }
      });

    } catch (error) {
      console.error('Email registration error:', error);
      // Send a more detailed error response
      res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: {
          message: error.message,
          type: error.name,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    }
  }

  // Helper method to create role-specific profiles
  static async createRoleSpecificProfile(userId, role, profileData) {
    const ArtisanProfile = require('../models/Artisan');
    const Distributor = require('../models/Distributor');

    try {
      if (role === 'artisan') {
        // Check if profile already exists
        const existingProfile = await ArtisanProfile.findOne({ userId });
        if (existingProfile) {
          console.log('Artisan profile already exists for user:', userId);
          return;
        }

        console.log('Creating new artisan profile for user:', userId);
        const artisanProfile = new ArtisanProfile({
          userId,
          bio: profileData.bio || '',
          region: profileData.region || 'Default Region',  // Always provide a default region
          skills: profileData.skills || []
        });
        await artisanProfile.save();
        console.log('Created artisan profile:', artisanProfile._id);
      } else if (role === 'distributor') {
        // Check if profile already exists
        const existingProfile = await Distributor.findOne({ userId });
        if (existingProfile) {
          console.log('Distributor profile already exists for user:', userId);
          return;
        }

        console.log('Creating new distributor profile for user:', userId);
        const distributorProfile = new Distributor({
          userId,
          businessName: profileData.businessName || 'New Business', // Provide default if empty
          licenseNumber: profileData.licenseNumber || '',
          distributionAreas: profileData.distributionAreas || []
        });
        await distributorProfile.save();
        console.log('Created distributor profile:', distributorProfile._id);
      }
    } catch (error) {
      console.error('Error creating role-specific profile:', error);
      throw error; // Throw error to handle it in the calling method
    }
  }
}

module.exports = AuthController;
