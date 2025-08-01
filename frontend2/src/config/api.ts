// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://cautious-zebra-x5549r5475j6f979-5000.app.github.dev',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      GOOGLE_OAUTH: '/api/auth/google',
      PROFILE: '/api/auth/profile',
      LOGOUT: '/api/auth/logout',
    }
  }
} as const;

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for Google OAuth with role
export const buildGoogleOAuthUrl = (role: 'customer' | 'artisan' | 'distributor'): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_OAUTH}?role=${role}`;
};
