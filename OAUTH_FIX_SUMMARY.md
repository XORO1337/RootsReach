# Google OAuth Flow Fix Summary

## Problem
The Google OAuth URLs in `Login.tsx` and `Signup.tsx` were using relative paths (`/api/auth/google`) which would redirect to the frontend URL instead of the backend API.

## Solution
Fixed the Google OAuth flow by:

1. **Updated OAuth URLs**: Changed from relative to absolute URLs pointing to the correct backend server
2. **Created API Configuration**: Added a centralized configuration file for better maintainability
3. **Role-based Redirection**: Ensured proper redirection after OAuth authentication

## Files Modified

### 1. `/frontend2/src/config/api.ts` (NEW)
- Centralized API configuration
- Helper functions for building URLs
- Specific function for Google OAuth URL with role parameter

### 2. `/frontend2/src/pages/auth/Login.tsx`
- Updated `handleGoogleAuth()` to use the correct backend URL
- Added import for API configuration
- Uses `buildGoogleOAuthUrl()` helper function

### 3. `/frontend2/src/pages/auth/Signup.tsx`
- Updated `handleGoogleAuth()` to use the correct backend URL
- Added import for API configuration
- Updated registration API URL to use configuration
- Uses `buildGoogleOAuthUrl()` helper function

## OAuth Flow

1. **User clicks "Continue with Google"** in Login/Signup
   - Role is stored in sessionStorage
   - Redirects to: `https://[backend]/api/auth/google?role=[selected_role]`

2. **Backend handles OAuth initiation** (`Auth_controller.js:initiateGoogleAuth`)
   - Extracts role from query parameter
   - Stores role in session
   - Initiates Google OAuth flow

3. **Google OAuth callback** (`Auth_controller.js:handleGoogleCallback`)
   - Retrieves role from session
   - Updates user role in database
   - Redirects to: `https://[frontend]/auth/callback?token=[jwt]&user=[userdata]&role=[role]`

4. **Frontend OAuth callback** (`OAuthCallback.tsx`)
   - Processes authentication data
   - Stores user data in auth context
   - Redirects based on role:
     - **Customer**: `/` (marketplace)
     - **Artisan**: `/artisan`
     - **Distributor**: `/distributor`

## Role-based Redirection Rules

- **Customer**: Redirected to `/` (main marketplace)
- **Artisan**: Redirected to `/artisan` (artisan dashboard)
- **Distributor**: Redirected to `/distributor` (distributor dashboard)

## Testing

The OAuth flow should now work correctly:
1. Select role on Login/Signup page
2. Click "Continue with Google"
3. Complete Google authentication
4. Get redirected to the appropriate dashboard based on selected role

## Benefits

1. **Fixed OAuth URLs**: Now points to correct backend endpoint
2. **Better maintainability**: Centralized API configuration
3. **Proper role handling**: Role selection is preserved through OAuth flow
4. **Correct redirection**: Users land on the right dashboard for their role
