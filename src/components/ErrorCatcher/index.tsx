import React from "react";

interface ErrorCatcherProps {
  onError: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class ErrorCatcher extends React.Component<ErrorCatcherProps> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorCatcher;
