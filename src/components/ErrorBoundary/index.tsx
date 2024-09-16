import React, { useState, ReactNode, ErrorInfo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ERROR_IMAGE from "../../assets/images/undraw_bug_fixing_oc-7-a.svg"; // Optional: error image
import ErrorCatcher from "../ErrorCatcher";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Simulate the componentDidCatch lifecycle method in functional component
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    setHasError(true);
    setError(error);
    logErrorToService(error, errorInfo);
  };

  const logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Logging error to service: ", { error, errorInfo });
    // Implement error logging here (e.g., send to Sentry, LogRocket)
  };

  const handleRetry = () => {
    setHasError(false);
    setError(null);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (hasError) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {/* Optional Error Image */}
        <Box
          component="img"
          src={ERROR_IMAGE}
          alt="Error Boundary"
          sx={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
        />

        {/* Error Message */}
        <Typography variant="h3" color="error" gutterBottom>
          Something Went Wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          An unexpected error occurred. Please try again, or contact support if
          the issue persists.
        </Typography>

        {/* Retry Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleRetry}
          sx={{ marginBottom: "10px" }}
        >
          Retry
        </Button>

        {/* Go Back to Home Button */}
        <Button variant="outlined" color="secondary" onClick={handleGoHome}>
          Go Back to Home
        </Button>

        {/* Optional: Display the error message for debugging */}
        <Typography
          variant="body2"
          color="error"
          sx={{ marginTop: "20px", wordBreak: "break-word" }}
        >
          {error?.message}
        </Typography>
      </Box>
    );
  }

  return <ErrorCatcher onError={handleError}>{children}</ErrorCatcher>;
};

// Helper component to catch errors in functional components (simulate componentDidCatch)
// class ErrorCatcher extends React.Component<{
//   onError: (error: Error, errorInfo: React.ErrorInfo) => void;
// }> {
//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     this.props.onError(error, errorInfo);
//   }

//   render() {
//     return this.props.children;
//   }
// }

export default ErrorBoundary;
