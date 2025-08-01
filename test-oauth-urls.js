// Test script to verify OAuth URLs are correct
import { buildGoogleOAuthUrl, buildApiUrl, API_CONFIG } from '../frontend2/src/config/api';

console.log('=== OAuth URL Tests ===');

// Test role-based URLs
const roles = ['customer', 'artisan', 'distributor'];

roles.forEach(role => {
  const url = buildGoogleOAuthUrl(role);
  console.log(`${role.toUpperCase()} OAuth URL:`, url);
  
  // Verify URL structure
  const expectedBase = 'https://cautious-zebra-x5549r5475j6f979-5000.app.github.dev/api/auth/google';
  const expectedQuery = `?role=${role}`;
  const expectedUrl = expectedBase + expectedQuery;
  
  if (url === expectedUrl) {
    console.log(`✅ ${role} URL is correct`);
  } else {
    console.log(`❌ ${role} URL is incorrect. Expected: ${expectedUrl}, Got: ${url}`);
  }
  console.log('');
});

console.log('=== API Endpoint Tests ===');

// Test other API URLs
const loginUrl = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
const registerUrl = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER);

console.log('Login URL:', loginUrl);
console.log('Register URL:', registerUrl);

console.log('\n=== OAuth Flow Test Summary ===');
console.log('1. User selects role on Login/Signup page');
console.log('2. Role is stored in sessionStorage');
console.log('3. User is redirected to:', buildGoogleOAuthUrl('artisan'));
console.log('4. Backend processes OAuth and redirects to: /auth/callback');
console.log('5. OAuthCallback.tsx processes authentication');
console.log('6. User is redirected based on role:');
console.log('   - Customer: /');
console.log('   - Artisan: /artisan');
console.log('   - Distributor: /distributor');
