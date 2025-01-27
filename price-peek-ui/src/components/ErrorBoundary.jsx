import React, { Component } from 'react';
import '../assets/styles/ErrorBoundary.css';
import { ERROR_MESSAGES, ERROR_CODES } from '../utils/error/errorMessage.const';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or send it to a monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    // Reset error state and retry rendering
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const errorCode = this.state.error?.code || ERROR_CODES.UNKNOWN_ERROR;
      const errorMessage = ERROR_MESSAGES[errorCode] || 'An unexpected error occurred.';

      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>{errorMessage}</p>
          <pre>{this.state.errorInfo?.componentStack}</pre>
          <button onClick={this.handleRetry}>Retry</button>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;