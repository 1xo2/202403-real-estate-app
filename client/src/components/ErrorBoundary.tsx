import React, { Component, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

type Props = {
  children: React.ReactNode;
};

//  catches JavaScript errors anywhere in its child component tree
export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { hasError: true, error: err, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught an error:\n", error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI if an error occurs
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
            <hr />
            {this.state.error?.message}
            <hr />
            {JSON.stringify(this.state.error)}
          </details>
        </div>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
}
