import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
          style={{ backgroundColor: '#f8eee7' }}
        >
          <div
            className="max-w-2xl w-full rounded-xl shadow-xl overflow-hidden border-2"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#94618e',
            }}
          >
            {/* Header */}
            <div
              className="px-6 sm:px-8 py-6 sm:py-8 text-center border-b-2"
              style={{ borderBottomColor: '#94618e' }}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#fee2e2' }}
              >
                <AlertTriangle size={32} className="sm:w-10 sm:h-10" style={{ color: '#991b1b' }} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
                Oops! Something went wrong
              </h1>
              <p className="text-sm sm:text-base" style={{ color: '#94618e', opacity: 0.8 }}>
                We're sorry, but an unexpected error occurred. Please try again.
              </p>
            </div>

            {/* Error Details */}
            <div className="px-6 sm:px-8 py-6 sm:py-8">
              {this.state.error && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#94618e' }}>
                    Error Details:
                  </h3>
                  <div
                    className="p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto"
                    style={{ backgroundColor: '#f8eee7', color: '#94618e' }}
                  >
                    <p className="font-semibold mb-2">{this.state.error.name}</p>
                    <p className="break-words">{this.state.error.message}</p>
                  </div>
                </div>
              )}

              {/* Stack Trace (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mb-6">
                  <summary
                    className="cursor-pointer text-sm font-semibold mb-2 hover:underline"
                    style={{ color: '#94618e' }}
                  >
                    Stack Trace (Click to expand)
                  </summary>
                  <div
                    className="p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto"
                    style={{ backgroundColor: '#f8eee7', color: '#94618e' }}
                  >
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  className="flex-1 justify-center"
                >
                  <RefreshCw size={18} />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 justify-center"
                >
                  <Home size={18} />
                  Go to Homepage
                </Button>
              </div>
            </div>

            {/* Footer Help Text */}
            <div
              className="px-6 sm:px-8 py-4 sm:py-5 border-t-2 text-center"
              style={{ borderTopColor: '#94618e', backgroundColor: '#f8eee7' }}
            >
              <p className="text-xs sm:text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                If this problem persists, please contact our support team at{' '}
                <a
                  href="mailto:support@cepathire.com"
                  className="font-semibold hover:underline"
                  style={{ color: '#94618e' }}
                >
                  support@cepathire.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
