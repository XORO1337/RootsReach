import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          Sorry, you do not have the necessary permissions to access this page.
        </p>
        <div className="mt-6">
          <Link
            to="/admin-login"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
