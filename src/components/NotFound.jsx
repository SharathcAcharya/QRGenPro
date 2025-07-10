import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import SEOHead from './SEOHead';

const NotFound = () => {
  return (
    <>
      <SEOHead
        title="Page Not Found | QRloop"
        description="The page you are looking for could not be found. Return to QRloop's homepage to generate QR codes."
        ogType="website"
      />
      
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">404</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/"
              className="block w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <span className="flex items-center justify-center">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </span>
            </Link>
            
            <Link
              to="/generator"
              className="block w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <span className="flex items-center justify-center">
                <Search className="w-4 h-4 mr-2" />
                Create a QR Code
              </span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="block w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <span className="flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </span>
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            <p>
              Need help? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
