import React from 'react';
import { buildApiUrl, buildGoogleOAuthUrl, API_CONFIG } from '../config/api';

const DebugOAuth: React.FC = () => {
  const testURLs = () => {
    console.log('=== URL Generation Debug ===');
    console.log('Window location:', window.location.href);
    console.log('Window hostname:', window.location.hostname);
    console.log('API Base URL:', API_CONFIG.BASE_URL);
    console.log('Google OAuth URL (artisan):', buildGoogleOAuthUrl('artisan'));
    console.log('Google OAuth URL (customer):', buildGoogleOAuthUrl('customer'));
    console.log('Google OAuth URL (distributor):', buildGoogleOAuthUrl('distributor'));
    console.log('Health check URL:', buildApiUrl('/api/health'));
  };

  const testGoogleOAuthRedirect = (role: 'customer' | 'artisan' | 'distributor') => {
    const url = buildGoogleOAuthUrl(role);
    console.log(`Testing ${role} OAuth URL:`, url);
    window.location.href = url;
  };

  const testHealthCheck = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/health'));
      const data = await response.json();
      console.log('Health check response:', data);
      alert('Health check successful! Check console for details.');
    } catch (error) {
      console.error('Health check failed:', error);
      alert('Health check failed! Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">OAuth Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">URL Information</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Window Location:</strong> {window.location.href}</p>
            <p><strong>Window Hostname:</strong> {window.location.hostname}</p>
            <p><strong>API Base URL:</strong> {API_CONFIG.BASE_URL}</p>
            <p><strong>Google OAuth Endpoint:</strong> {API_CONFIG.ENDPOINTS.AUTH.GOOGLE_OAUTH}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generated URLs</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Artisan OAuth:</strong> <span className="text-blue-600">{buildGoogleOAuthUrl('artisan')}</span></p>
            <p><strong>Customer OAuth:</strong> <span className="text-blue-600">{buildGoogleOAuthUrl('customer')}</span></p>
            <p><strong>Distributor OAuth:</strong> <span className="text-blue-600">{buildGoogleOAuthUrl('distributor')}</span></p>
            <p><strong>Health Check:</strong> <span className="text-blue-600">{buildApiUrl('/api/health')}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testURLs}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Log URLs to Console
            </button>
            <button
              onClick={testHealthCheck}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Health Check
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test OAuth Redirects</h2>
          <p className="text-gray-600 mb-4">Click these buttons to test the actual OAuth flow:</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => testGoogleOAuthRedirect('artisan')}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Test Artisan OAuth
            </button>
            <button
              onClick={() => testGoogleOAuthRedirect('customer')}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Test Customer OAuth
            </button>
            <button
              onClick={() => testGoogleOAuthRedirect('distributor')}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Test Distributor OAuth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugOAuth;
