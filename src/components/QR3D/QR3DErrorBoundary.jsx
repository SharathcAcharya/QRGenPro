import React, { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class QR3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Rendering Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              3D Rendering Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              There was a problem rendering the 3D QR code. This could be due to 
              WebGL not being supported or enabled in your browser.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto text-left">
              {this.state.error && this.state.error.message}
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default QR3DErrorBoundary;
