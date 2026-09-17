import { Component } from 'react';
import ErrorPage from './ErrorPage';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production, log to an error-tracking service like Sentry or LogRocket
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F7F2EB',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <ErrorPage onRetry={() => window.location.reload()} />
        </div>
      );
    }

    return this.props.children;
  }
}