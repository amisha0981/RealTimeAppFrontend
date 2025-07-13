import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-600">
          <h2 className="text-xl font-bold">Something went wrong!</h2>
          <p className="mt-2">Error: {this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;