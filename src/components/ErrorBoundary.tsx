import React, { Component, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Icon from './AppIcon';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-error-50 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={32} className="text-error" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Algo salió mal
            </h1>
            
            <p className="text-text-secondary mb-6">
              Lo sentimos, pero algo inesperado sucedió. Por favor intenta refrescar la página o contacta soporte si el problema persiste.
            </p>

            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="RefreshCw" size={18} color="#fff" />
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 